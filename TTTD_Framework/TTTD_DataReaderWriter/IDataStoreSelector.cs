using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_DataReaderWriter
{
    public interface IDataStoreSelector
    {
        string DataStore { get; }
        bool Select(string defaultPath);
    }
}
