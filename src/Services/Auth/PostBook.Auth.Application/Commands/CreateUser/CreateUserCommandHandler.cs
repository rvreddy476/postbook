using AutoMapper;
using MediatR;
using PostBook.Auth.Application.Common;
using PostBook.Auth.Application.DTOs;
using PostBook.Auth.Application.Interfaces;
using PostBook.Auth.Domain.Entities;
using PostBook.Auth.Domain.Interfaces;
using PostBook.Auth.Domain.ValueObjects;

namespace PostBook.Auth.Application.Commands.CreateUser;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Result<UserDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IMapper _mapper;

    public CreateUserCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _mapper = mapper;
    }

    public async Task<Result<UserDto>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Create email value object
            var email = Email.Create(request.Email);

            // Check if email already exists
            if (await _userRepository.ExistsByEmailAsync(email, cancellationToken))
            {
                return Result<UserDto>.Failure("Email already exists");
            }

            // Check if username already exists
            if (await _userRepository.ExistsByUsernameAsync(request.Username, cancellationToken))
            {
                return Result<UserDto>.Failure("Username already taken");
            }

            // Hash password
            var passwordHash = _passwordHasher.HashPassword(request.Password);

            // Create phone number value object if provided
            PhoneNumber? phoneNumber = null;
            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                phoneNumber = PhoneNumber.Create(request.PhoneNumber);
            }

            // Create user entity
            var user = User.Create(
                request.Username,
                email,
                passwordHash,
                request.FirstName,
                request.LastName,
                phoneNumber);

            // Save to database
            await _userRepository.AddAsync(user, cancellationToken);
            await _userRepository.SaveChangesAsync(cancellationToken);

            // Map to DTO and return
            var userDto = _mapper.Map<UserDto>(user);
            return Result<UserDto>.Success(userDto);
        }
        catch (ArgumentException ex)
        {
            return Result<UserDto>.Failure(ex.Message);
        }
        catch (Exception ex)
        {
            return Result<UserDto>.Failure($"Failed to create user: {ex.Message}");
        }
    }
}
