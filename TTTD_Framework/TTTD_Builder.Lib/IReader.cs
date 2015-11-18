using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TTTD_Builder.Lib
{
    public interface IReader<T> where T : object
    {
        IEnumerable<T> Read(DateTime time);
    }
}
