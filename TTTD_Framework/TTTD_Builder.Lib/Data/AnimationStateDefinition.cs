using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_Builder.Lib.Data
{
    public class AnimationStateDefinition
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int GraphicsInstanceDefinitionId { get; set; }
        public int State { get; set; }
    }
}