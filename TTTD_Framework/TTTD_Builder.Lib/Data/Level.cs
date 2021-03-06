using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Lib.Helpers;


namespace TTTD_Builder.Lib.Data
{
    public class Level
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? Order { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public PositionInformation PlayerPosition { get; set; }
    }
}