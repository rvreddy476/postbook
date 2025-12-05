using PostBook.Auth.Domain.Entities;

namespace PostBook.Auth.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    DateTime GetTokenExpiration();
}
