using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_Sanitizer.Lib.Data
{
    public class BehaviorInstanceDefinition
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int EntityInstanceDefinitionId { get; set; }
        public string BehaviorFile { get; set; }
        public string BehaviorConstructor { get; set; }
    }
}