using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;


namespace TTTD_Builder.Lib.JSONReaderWriter
{
    public static class Writer<T> : TTTD_Builder.Lib.IWriter<T>
    {
        #region MEMBER FIELDS

        const string c_jsonExtension = ".json";

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public void Write(IEnumerable<T> objectsToWrite, DateTime time)
        {
            if(objectsToWrite == null || !objectsToWrite.Any())
                return;

            string timeStamp = time.ToString("dd-MM-yyyy");

            if (!Directory.Exists(timeStamp))
                Directory.CreateDirectory(timeStamp);

            string fileName = Path.Combine(timeStamp, typeof(T).Name, c_jsonExtension);

            File.WriteAllLines(fileName, objectsToWrite.Select(x => JsonConvert.SerializeObject(x)));
        }

        #endregion

        #endregion
    }
}
