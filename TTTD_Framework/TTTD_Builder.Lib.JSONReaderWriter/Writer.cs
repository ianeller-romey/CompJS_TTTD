using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

using Data = TTTD_Builder.Lib.Data;


namespace TTTD_Builder.Lib.JSONReaderWriter
{
    public class Writer : TTTD_Builder.Lib.IWriter
    {
        #region MEMBER FIELDS

        const string c_jsonExtension = ".json";
        static readonly JsonSerializerSettings s_jsonSerializerSettings = new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() };

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public void Write<T>(IEnumerable<T> objectsToWrite, IDataStoreSelector selector) where T : Data.IHasId
        {
            if(selector == null || objectsToWrite == null || !objectsToWrite.Any())
                return;

            if (string.IsNullOrEmpty(selector.DataStore) && !selector.Select())
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
