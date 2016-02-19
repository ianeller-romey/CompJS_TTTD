using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_Builder.Lib.Data
{
    public class GraphicsInstanceDefinition
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int EntityInstanceDefinitionId { get; set; }
    }
}