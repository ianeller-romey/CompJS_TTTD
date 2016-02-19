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
using TTTD_Builder.Model.Extensions;


namespace TTTD_Builder.Controls.TabControls
{
    public class TabItem_PhysicsInstanceDefinition : TabItem
    {
        #region MEMBER FIELDS

        Grid m_grid_main;
        UserControl_NewAndSelect<PhysicsInstanceDefinition> m_comboBox_physicsInstanceDefinitions;
        UserControl_PhysicsInstanceDefinition m_userControl_physicsInstanceDefinition;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public TabItem_PhysicsInstanceDefinition()
        {
            Header = "Physics Instance Definitions";
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
            m_comboBox_physicsInstanceDefinitions = new UserControl_NewAndSelect<PhysicsInstanceDefinition>(DataManager.PhysicsInstanceDefinitions, New, Select);
            m_grid_main.SetGridRowColumn(m_comboBox_physicsInstanceDefinitions, 0, 0);

            ////////
            // Fin
            Content = m_grid_main;
        }

        private void RemoveUserControl()
        {
            if (m_userControl_physicsInstanceDefinition != null)
                m_grid_main.Children.Remove(m_userControl_physicsInstanceDefinition);
            m_userControl_physicsInstanceDefinition = null;
        }

        private void New()
        {
            RemoveUserControl();
            m_userControl_physicsInstanceDefinition = new UserControl_PhysicsInstanceDefinition(null);
            m_grid_main.SetGridRowColumn(m_userControl_physicsInstanceDefinition, 1, 0);
        }

        private void Select(PhysicsInstanceDefinition physicsInstanceDefinition)
        {
            RemoveUserControl();

            if (physicsInstanceDefinition.BoundingData.ToLowerInvariant().Contains("halfvalues"))
            {
                m_userControl_physicsInstanceDefinition = new UserControl_PhysicsInstanceDefinition(new PhysicsInstanceDefinition_WithAABB(physicsInstanceDefinition));
            }
            else if (physicsInstanceDefinition.BoundingData.ToLowerInvariant().Contains("radius"))
            {
                m_userControl_physicsInstanceDefinition = new UserControl_PhysicsInstanceDefinition(new PhysicsInstanceDefinition_WithCircle(physicsInstanceDefinition));
            }

            m_grid_main.SetGridRowColumn(m_userControl_physicsInstanceDefinition, 1, 0);
        }

        #endregion

        #endregion
    }
}
