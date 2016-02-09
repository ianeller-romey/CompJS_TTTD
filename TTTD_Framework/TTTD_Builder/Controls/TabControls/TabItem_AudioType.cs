using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

using TTTD_Builder.EditData;
using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.Controls.TabControls
{
    public class TabItem_AudioType : TabItem
    {
        #region MEMBER FIELDS

        Grid m_grid_main;
        UserControl_NewAndSelect<AudioType> m_comboBox_audioTypes;
        UserControl_AudioType m_userControl_audioType;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public TabItem_AudioType()
        {
            Header = "Audio Types";
            CreateControls();
        }

        #endregion


        #region Private Functionality

        private void CreateControls()
        {
            m_grid_main = new Grid();
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(100.0, GridUnitType.Star) });

            ////////
            // ComboBox
            m_comboBox_audioTypes = new UserControl_NewAndSelect<AudioType>(DataManager.AudioTypes, New, Select);
            m_grid_main.SetGridRowColumn(m_comboBox_audioTypes, 0, 0);

            ////////
            // Fin
            Content = m_grid_main;
        }

        private void RemoveUserControl()
        {
            if (m_userControl_audioType != null)
                m_grid_main.Children.Remove(m_userControl_audioType);
            m_userControl_audioType = null;
        }

        private void New()
        {
            RemoveUserControl();
            m_userControl_audioType = new UserControl_AudioType(null);
            m_grid_main.SetGridRowColumn(m_userControl_audioType, 1, 0);
        }

        private void Select(AudioType audioType)
        {
            RemoveUserControl();
            m_userControl_audioType = new UserControl_AudioType(audioType);
            m_grid_main.SetGridRowColumn(m_userControl_audioType, 1, 0);
        }

        #endregion

        #endregion
    }
}
