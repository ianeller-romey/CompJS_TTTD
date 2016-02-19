using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

using TTTD_Builder.Model.Extensions.Base;
using TTTD_Builder.Model.Data;
using TTTD_Builder.Model.Interfaces;


namespace TTTD_Builder.Model.Extensions
{
    public class PhysicsInstanceDefinition_WithCircle : PhysicsInstanceDefinition_Ex
    {
        #region MEMBER FIELDS

        private double m_originX;
        private double m_originY;
        private double m_radius;

        #endregion


        #region MEMBER PROPERTIES

        public double OriginX
        {
            get { return m_originX; }
            set
            {
                if (value != m_originX)
                {
                    m_originX = value;
                    NotifyPropertyChanged("OriginX");
                    SetBoundingData(CalculateBoundingObject());
                }
            }
        }

        public double OriginY
        {
            get { return m_originY; }
            set
            {
                if (value != m_originY)
                {
                    m_originY = value;
                    NotifyPropertyChanged("OriginY");
                    SetBoundingData(CalculateBoundingObject());
                }
            }
        }

        public double Radius
        {
            get { return m_radius; }
            set
            {
                if (value != m_radius)
                {
                    m_radius = value;
                    NotifyPropertyChanged("Radius");
                    SetBoundingData(CalculateBoundingObject());
                }
            }
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public PhysicsInstanceDefinition_WithCircle(PhysicsInstanceDefinition physicsInstanceDefinition) :
            base(physicsInstanceDefinition, PhysicsInstanceDefinitionType.Circle)
        {
        }

        #endregion


        #region Protected Functionality

        protected override void ParseBoundingData(string boundingData)
        {
            dynamic boundingObject = 
                JsonConvert.DeserializeObject<ExpandoObject>(boundingData, new JsonSerializerSettings()
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    Converters = new List<JsonConverter> { new CamelCaseToPascalCaseExpandoObjectConverter() }
                });
            OriginX = boundingObject.Origin.X;
            OriginY = boundingObject.Origin.Y;
            Radius = boundingObject.Radius;
        }

        protected override object CalculateBoundingObject()
        {
            return new
            {
                Origin =
                    new
                    {
                        X = OriginX,
                        Y = OriginY
                    },
                Radius = Radius
            };
            
        }

        #endregion

        #endregion
    }
}
