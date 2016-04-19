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
    public class PhysicsInstanceDefinition_WithFont : PhysicsInstanceDefinition_Ex
    {
        #region MEMBER FIELDS

        private double m_characterWidth;
        private double m_characterHeight;
        private double m_startLeft;
        private double m_startTop;

        #endregion


        #region MEMBER PROPERTIES

        public double CharacterWidth
        {
            get { return m_characterWidth; }
            set
            {
                if (value != m_characterWidth)
                {
                    m_characterWidth = value;
                    NotifyPropertyChanged("CharacterWidth");
                    SetBoundingData(CalculateBoundingObject());
                }
            }
        }

        public double CharacterHeight
        {
            get { return m_characterHeight; }
            set
            {
                if (value != m_characterHeight)
                {
                    m_characterHeight = value;
                    NotifyPropertyChanged("CharacterHeight");
                    SetBoundingData(CalculateBoundingObject());
                }
            }
        }

        public double StartLeft
        {
            get { return m_startLeft; }
            set
            {
                if (value != m_startLeft)
                {
                    m_startLeft = value;
                    NotifyPropertyChanged("StartLeft");
                    SetBoundingData(CalculateBoundingObject());
                }
            }
        }

        public double StartTop
        {
            get { return m_startTop; }
            set
            {
                if (value != m_startTop)
                {
                    m_startTop = value;
                    NotifyPropertyChanged("StartTop");
                    SetBoundingData(CalculateBoundingObject());
                }
            }
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public PhysicsInstanceDefinition_WithFont(PhysicsInstanceDefinition physicsInstanceDefinition) :
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
            try { CharacterWidth = boundingObject.CharacterWidth; } catch (Exception) { }
            try { CharacterHeight = boundingObject.CharacterHeight; } catch (Exception) { }
        }

        protected override object CalculateBoundingObject()
        {
            return new
            {
                CharacterWidth = CharacterWidth,
                CharacterHeight = CharacterHeight,
                StartLeft = StartLeft,
                StartTop = StartTop
            };
            
        }

        #endregion

        #endregion
    }
}
