namespace PostBook.Auth.Domain.Exceptions;

public class AuthException : DomainException
{
    public AuthException(string message) : base(message)
    {
    }

    public AuthException(string message, Exception innerException) 
        : base(message, innerException)
    {
    }
}
