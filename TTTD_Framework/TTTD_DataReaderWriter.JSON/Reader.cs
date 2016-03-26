using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;


namespace TTTD_DataReaderWriter.JSON
{
    public class Reader : TTTD_DataReaderWriter.IReader
    {
        #region MEMBER FIELDS

        const string c_jsonExtension = ".json";
        static readonly JsonSerializerSettings s_jsonSerializerSettings = new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() };

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public IEnumerable<T> Read<T>(IDataStoreSelector selector, string defaultPath)
        {
            if (selector == null)
                return null;

            if (string.IsNullOrEmpty(selector.DataStore) && !selector.Select(defaultPath))
                return null;

            if (!Directory.Exists(selector.DataStore))
                return null;

            string fileName = Path.Combine(selector.DataStore, Path.ChangeExtension(typeof(T).Name, c_jsonExtension));

            return (File.Exists(fileName)) ? JsonConvert.DeserializeObject<IEnumerable<T>>(File.ReadAllText(fileName), s_jsonSerializerSettings) : null;
        }

        #endregion

        #endregion
    }
}
