using AutoMapper;
using MediatR;
using PostBook.Auth.Application.Common;
using PostBook.Auth.Application.DTOs;
using PostBook.Auth.Domain.Interfaces;

namespace PostBook.Auth.Application.Queries.GetUser;

public class GetUserQueryHandler : IRequestHandler<GetUserQuery, Result<UserDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public GetUserQueryHandler(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<Result<UserDto>> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);

        if (user == null || user.IsDeleted)
        {
            return Result<UserDto>.Failure("User not found");
        }

        var userDto = _mapper.Map<UserDto>(user);
        return Result<UserDto>.Success(userDto);
    }
}
