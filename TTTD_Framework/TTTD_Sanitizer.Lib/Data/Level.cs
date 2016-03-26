using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_Sanitizer.Lib.Data
{
    public class Level
    {
        public class LevelLayout
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public int LevelId { get; set; }
            public int EntityInstanceDefinitionId { get; set; }
            public KeyValuePair<string, object>[] Data { get; set; }
            public double X { get; set; }
            public double Y { get; set; }
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int? Order { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public LevelLayout[] Layout { get; set; }
    }
}