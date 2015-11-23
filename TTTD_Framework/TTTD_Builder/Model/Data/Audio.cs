using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Base;


namespace TTTD_Builder.Model.Data
{
    public class Audio : DataBase
    {
        #region MEMBER FIELDS

        private AudioType m_audioType;
        private string m_audioFile;

        #endregion


        #region MEMBER PROPERTIES

        public AudioType AudioType
        {
            get { return m_audioType; }
            set { if (value != m_audioType) { m_audioType = value; NotifyPropertyChanged("AudioType"); } }
        }

        public string AudioFile
        {
            get { return m_audioFile; }
            set { if (value != m_audioFile) { m_audioFile = value; NotifyPropertyChanged("AudioFile"); } }
        }

        #endregion
    }
}
