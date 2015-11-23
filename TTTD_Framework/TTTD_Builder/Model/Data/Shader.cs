using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Base;


namespace TTTD_Builder.Model.Data
{
    public class Shader : DataBase
    {
        #region MEMBER FIELDS

        private string m_shaderFile;

        #endregion


        #region MEMBER PROPERTIES

        public string ShaderFile
        {
            get { return m_shaderFile; }
            set { if (value != m_shaderFile) { m_shaderFile = value; NotifyPropertyChanged("Shader"); } }
        }

        #endregion
    }
}
