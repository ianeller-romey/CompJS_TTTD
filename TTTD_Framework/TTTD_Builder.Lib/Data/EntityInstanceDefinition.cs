using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_Builder.Lib.Data
{
    public class EntityInstanceDefinition : IHasId
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
