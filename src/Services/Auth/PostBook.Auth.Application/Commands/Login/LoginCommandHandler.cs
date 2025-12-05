using AutoMapper;
using MediatR;
using PostBook.Auth.Application.Common;
using PostBook.Auth.Application.DTOs;
using PostBook.Auth.Application.Interfaces;
using PostBook.Auth.Domain.Interfaces;

namespace PostBook.Auth.Application.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<LoginResponseDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IMapper _mapper;

    public LoginCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _mapper = mapper;
    }

    public async Task<Result<LoginResponseDto>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Find user by email or username
            var user = await _userRepository.GetByEmailOrUsernameAsync(request.Identifier, cancellationToken);

            if (user == null)
            {
                return Result<LoginResponseDto>.Failure("Invalid credentials");
            }

            // Check if account is locked
            if (user.IsAccountLocked())
            {
                return Result<LoginResponseDto>.Failure("Account is temporarily locked. Please try again later.");
            }

            // Check if account is deleted or suspended
            if (user.IsDeleted)
            {
                return Result<LoginResponseDto>.Failure("Account has been deleted");
            }

            if (user.Status == Domain.Enums.AccountStatus.Suspended)
            {
                return Result<LoginResponseDto>.Failure("Account has been suspended");
            }

            // Verify password
            if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                user.RecordFailedLogin();
                await _userRepository.UpdateAsync(user, cancellationToken);
                await _userRepository.SaveChangesAsync(cancellationToken);

                return Result<LoginResponseDto>.Failure("Invalid credentials");
            }

            // Record successful login
            user.RecordSuccessfulLogin();
            await _userRepository.UpdateAsync(user, cancellationToken);
            await _userRepository.SaveChangesAsync(cancellationToken);

            // Generate tokens
            var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);
            var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();
            var expiresAt = _jwtTokenGenerator.GetTokenExpiration();

            // Create response
            var response = new LoginResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = expiresAt,
                User = _mapper.Map<UserDto>(user)
            };

            return Result<LoginResponseDto>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<LoginResponseDto>.Failure($"Login failed: {ex.Message}");
        }
    }
}
