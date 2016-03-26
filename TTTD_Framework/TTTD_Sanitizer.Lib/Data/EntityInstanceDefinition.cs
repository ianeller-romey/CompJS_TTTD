using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_Sanitizer.Lib.Data
{
    public class EntityInstanceDefinition
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? Behavior { get; set; }
        public int? Graphics { get; set; }
        public int? Physics { get; set; }
        public int? Audible { get; set; }
    }
}