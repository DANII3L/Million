using MillionApi.Models;

namespace MillionApi.Interfaces
{
    public interface IAuth
    {
        Task<(bool success, string? token, Auth_Model? user)> LoginAsync(Auth_Model auth_Model);
    }
}
