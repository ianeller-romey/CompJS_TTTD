using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Lib.Helpers;


namespace TTTD_Builder.Lib.Data
{
    public class LevelLayout : PositionInformation
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int LevelId { get; set; }
        public int EntityInstanceDefinitionId { get; set; }
        public int Priority { get; set; }
        public KeyValuePair<string, object>[] Data { get; set; }
    }
}