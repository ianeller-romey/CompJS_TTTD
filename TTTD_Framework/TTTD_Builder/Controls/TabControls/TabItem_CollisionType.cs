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
    public class TabItem_CollisionType : TabItem
    {
        #region MEMBER FIELDS

        Grid m_grid_main;
        UserControl_NewAndSelect<CollisionType> m_comboBox_collisionTypes;
        UserControl_CollisionType m_userControl_collisionType;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public TabItem_CollisionType()
        {
            Header = "Collision Types";
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
            m_comboBox_collisionTypes = new UserControl_NewAndSelect<CollisionType>(DataManager.CollisionTypes, New, Select);
            m_grid_main.SetGridRowColumn(m_comboBox_collisionTypes, 0, 0);

            ////////
            // Fin
            Content = m_grid_main;
        }

        private void RemoveUserControl()
        {
            if (m_userControl_collisionType != null)
                m_grid_main.Children.Remove(m_userControl_collisionType);
            m_userControl_collisionType = null;
        }

        private void New()
        {
            RemoveUserControl();
            m_userControl_collisionType = new UserControl_CollisionType(null);
            m_grid_main.SetGridRowColumn(m_userControl_collisionType, 1, 0);
        }

        private void Select(CollisionType collisionType)
        {
            RemoveUserControl();
            m_userControl_collisionType = new UserControl_CollisionType(collisionType);
            m_grid_main.SetGridRowColumn(m_userControl_collisionType, 1, 0);
        }

        #endregion

        #endregion
    }
}
