using MediatR;
using PostBook.Auth.Application.Common;
using PostBook.Auth.Application.DTOs;

namespace PostBook.Auth.Application.Queries.GetUser;

public record GetUserQuery(Guid UserId) : IRequest<Result<UserDto>>;
