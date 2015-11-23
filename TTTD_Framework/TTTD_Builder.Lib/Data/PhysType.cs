using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_Builder.Lib.Data
{
    public class PhysicsInstanceDefinition
    {
        public int Id { get; set; }
        public int EntityInstanceDefinitionId { get; set; }
        public int PhysTypeId { get; set; }
        public int CollisionTypeId { get; set; }
        public string BoundingData { get; set; }
    }
}