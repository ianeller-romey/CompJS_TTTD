using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.Controls.TabControls
{
    public class TabItem_PhysType : TabItem
    {
        #region MEMBER FIELDS

        Grid m_grid_main;
        UserControl_NewAndSelect<PhysType> m_comboBox_physTypes;
        UserControl_PhysType m_userControl_physType;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public TabItem_PhysType()
        {
            Header = "Phys Types";
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
            m_comboBox_physTypes = new UserControl_NewAndSelect<PhysType>(DataManager.PhysTypes, New, Select);
            m_grid_main.SetGridRowColumn(m_comboBox_physTypes, 0, 0);

            ////////
            // Fin
            Content = m_grid_main;
        }

        private void RemoveUserControl()
        {
            if (m_userControl_physType != null)
                m_grid_main.Children.Remove(m_userControl_physType);
            m_userControl_physType = null;
        }

        private void New()
        {
            RemoveUserControl();
            m_userControl_physType = new UserControl_PhysType(null);
            m_grid_main.SetGridRowColumn(m_userControl_physType, 1, 0);
        }

        private void Select(PhysType physType)
        {
            RemoveUserControl();
            m_userControl_physType = new UserControl_PhysType(physType);
            m_grid_main.SetGridRowColumn(m_userControl_physType, 1, 0);
        }

        #endregion

        #endregion
    }
}
