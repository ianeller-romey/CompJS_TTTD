using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_DataReaderWriter
{
    public interface IWriter
    {
        void Write<T>(IEnumerable<T> objectsToWrite, IDataStoreSelector selector, string defaultPath);
    }
}
