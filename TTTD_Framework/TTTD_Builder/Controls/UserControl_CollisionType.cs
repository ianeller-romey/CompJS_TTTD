using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Lib.Data;
using TTTD_Builder.Managers;


namespace TTTD_Builder.Controls
{
    public class UserControl_CollisionType : UserControl
    {
        #region MEMBER FIELDS

        private CollisionType m_collisionType;

        private TextBox m_textBox_name;
        private GroupBox_Activatable m_groupBox;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_CollisionType(CollisionType collisionType)
        {
            m_collisionType = collisionType;

            CreateControls();
        }

        #endregion


        #region Private Functionality

        private void CreateControls()
        {
            Grid grid_main = new Grid();
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });

            ////////
            // Name
            m_textBox_name = new TextBox() { VerticalAlignment = VerticalAlignment.Center, Text = (m_collisionType != null) ? m_collisionType.Name : string.Empty };
            Label label_name = new Label() { Content = "Name: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            grid_main.SetGridRowColumn(m_textBox_name, 0, 1);
            grid_main.SetGridRowColumn(label_name, 0, 0);

            ////////
            // GroupBox
            m_groupBox = new GroupBox_Activatable("Collision Type", grid_main, false);
            m_groupBox.ChangesAccepted += () =>
                {
                    if (m_collisionType == null)
                        AddNewData();
                    else
                        UpdateExistingData();
                };
            m_groupBox.ChangesCancelled += () =>
                {
                    if (m_collisionType == null)
                        RevertData();
                    else
                        RevertExistingData();
                };
            Content = m_groupBox;
            
        }

        private void AddNewData()
        {
            m_collisionType = new CollisionType();
            m_collisionType.Name = m_textBox_name.Text;

            DataManager.CollisionTypes.Add(m_collisionType);
        }

        private void UpdateExistingData()
        {
            m_collisionType.Name = m_textBox_name.Text;
        }

        private void RevertData()
        {
            m_textBox_name.Text = string.Empty;
        }

        private void RevertExistingData()
        {
            m_textBox_name.Text = m_collisionType.Name;
        }

        #endregion

        #endregion
    }
}
