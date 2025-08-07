using MillionApi.Interfaces;
using MillionApi.Models;

public class ObjectService : IObject
{
    private readonly IDataBase _dataBase;

    public ObjectService(IDataBase dataBase)
    {
        _dataBase = dataBase;
    }

    public async Task<IEnumerable<Object_Model>> GetAsync()
    {
        var parameters = new MongoParameters("objects");
        var result = await _dataBase.EjecutarConsultaAsync<Object_Model>(parameters);
        return result.Data;
    }
}