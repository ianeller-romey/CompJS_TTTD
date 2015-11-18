using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TTTD_Builder.Lib
{
    public interface IWriter<T>
    {
        void Write(IEnumerable<T> objectsToWrite, DateTime time);
    }
}
