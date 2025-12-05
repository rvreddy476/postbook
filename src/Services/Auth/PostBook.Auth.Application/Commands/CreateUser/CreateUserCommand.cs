using MediatR;
using PostBook.Auth.Application.Common;
using PostBook.Auth.Application.DTOs;

namespace PostBook.Auth.Application.Commands.CreateUser;

public record CreateUserCommand(
    string Username,
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? PhoneNumber = null
) : IRequest<Result<UserDto>>;
