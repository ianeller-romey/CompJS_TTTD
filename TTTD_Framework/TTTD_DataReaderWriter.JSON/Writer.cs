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
    public class Writer : TTTD_DataReaderWriter.IWriter
    {
        #region MEMBER FIELDS

        const string c_jsonExtension = ".json";
        static readonly JsonSerializerSettings s_jsonSerializerSettings = new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() };

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public void Write<T>(IEnumerable<T> objectsToWrite, IDataStoreSelector selector, string defaultPath)
        {
            if(selector == null || objectsToWrite == null || !objectsToWrite.Any())
                return;

            if (string.IsNullOrEmpty(selector.DataStore) && !selector.Select(defaultPath))
                return;

            if (!Directory.Exists(selector.DataStore))
                Directory.CreateDirectory(selector.DataStore);

            string fileName = Path.Combine(selector.DataStore, Path.ChangeExtension(typeof(T).Name, c_jsonExtension));

            File.WriteAllText(fileName, JsonConvert.SerializeObject(objectsToWrite, s_jsonSerializerSettings));
        }

        #endregion

        #endregion
    }
}
