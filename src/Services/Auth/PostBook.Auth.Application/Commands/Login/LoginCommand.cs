using MediatR;
using PostBook.Auth.Application.Common;
using PostBook.Auth.Application.DTOs;

namespace PostBook.Auth.Application.Commands.Login;

public record LoginCommand(
    string Identifier, // Email or Username
    string Password
) : IRequest<Result<LoginResponseDto>>;
