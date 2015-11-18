using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;


namespace TTTD_Builder.Lib.JSONReaderWriter
{
    public static class Reader<T> : TTTD_Builder.Lib.IReader<T>
    {
        #region MEMBER FIELDS

        const string c_jsonExtension = ".json";

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public IEnumerable<T>  Write(DateTime time)
        {
            string timeStamp = time.ToString("dd-MM-yyyy");

            if (!Directory.Exists(timeStamp))
                return null;

            string fileName = Path.Combine(timeStamp, typeof(T).Name, c_jsonExtension);

            return File.ReadAllLines(fileName).Select(x => JsonConvert.DeserializeObject<T>(x)).ToList();
        }

        #endregion

        #endregion
    }
}
