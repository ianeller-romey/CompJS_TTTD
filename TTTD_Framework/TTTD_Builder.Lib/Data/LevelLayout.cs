using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_Builder.Lib.Data
{
    public class LevelLayout
    {
        public int Id { get; set; }
        public int LevelId { get; set; }
        public int EntityInstanceDefinitionId { get; set; }
        public double? X { get; set; }
        public double? Y { get; set; }
    }
}
