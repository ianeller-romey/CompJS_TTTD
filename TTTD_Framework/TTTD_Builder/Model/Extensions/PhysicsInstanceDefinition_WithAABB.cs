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
    public class PhysicsInstanceDefinition_WithAABB : PhysicsInstanceDefinition_Ex
    {
        #region MEMBER FIELDS

        private double m_originX;
        private double m_originY;
        private double m_halfValueX;
        private double m_halfValueY;

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

        public double HalfValueX
        {
            get { return m_halfValueX; }
            set
            {
                if (value != m_halfValueX)
                {
                    m_halfValueX = value;
                    NotifyPropertyChanged("HalfValueX");
                    SetBoundingData(CalculateBoundingObject());
                }
            }
        }

        public double HalfValueY
        {
            get { return m_halfValueY; }
            set
            {
                if (value != m_halfValueY)
                {
                    m_halfValueY = value;
                    NotifyPropertyChanged("HalfValueY");
                    SetBoundingData(CalculateBoundingObject());
                }
            }
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public PhysicsInstanceDefinition_WithAABB(PhysicsInstanceDefinition physicsInstanceDefinition) :
            base(physicsInstanceDefinition, PhysicsInstanceDefinitionType.AABB)
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
            HalfValueX = boundingObject.HalfValues.Width;
            HalfValueY = boundingObject.HalfValues.Height;
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
                HalfValues =
                    new
                    {
                        Width = HalfValueX,
                        Height = HalfValueY
                    }
            };
            
        }

        #endregion

        #endregion
    }
}
