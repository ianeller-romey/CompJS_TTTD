using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Data = TTTD_Builder.Lib.Data;


namespace TTTD_Builder.Lib
{
    public interface IReader
    {
        IEnumerable<T> Read<T>(IDataStoreSelector selector) where T : Data.IHasId;
    }
}
