using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostBook.Auth.Application.Commands.CreateUser;
using PostBook.Auth.Application.Commands.Login;
using PostBook.Auth.Application.Queries.GetUser;
using System.Security.Claims;

namespace PostBook.Auth.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] CreateUserCommand command)
    {
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
            return BadRequest(new { error = result.Error });

        return CreatedAtAction(
            nameof(GetCurrentUser),
            new { },
            new { success = true, data = result.Value });
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
            return Unauthorized(new { error = result.Error });

        return Ok(new { success = true, data = result.Value });
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { error = "Invalid token" });
        }

        var query = new GetUserQuery(userId);
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
            return NotFound(new { error = result.Error });

        return Ok(new { success = true, data = result.Value });
    }

    [HttpGet("health")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Health()
    {
        return Ok(new
        {
            service = "Auth Service",
            status = "healthy",
            timestamp = DateTime.UtcNow
        });
    }
}
