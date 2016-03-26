using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

using Xceed.Wpf.Toolkit;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Controls.Validation;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.EditData
{
    public class UserControl_Level : UserControl_EditData
    {
        #region MEMBER FIELDS

        private Level m_level;

        private TextBlock m_textBlock_id;
        private TextBox m_textBox_name;
        private IntegerUpDown m_integerUpDown_order;
        private DoubleUpDown m_doubleUpDown_width;
        private DoubleUpDown m_doubleUpDown_height;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_Level(Level level) :
            base("Level", false)
        {
            m_level = level;

            if (DataIsNull())
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
                m_integerUpDown_order.Value = null;
                m_doubleUpDown_width.Value = null;
                m_doubleUpDown_height.Value = null;
            }
            else
            {
                m_textBlock_id.Text = m_level.Id.ToString();
                m_textBox_name.Text = m_level.Name;
                m_integerUpDown_order.Value = m_level.Order;
                m_doubleUpDown_width.Value = m_level.Width;
                m_doubleUpDown_height.Value = m_level.Height;   
            }
        }

        #endregion


        #region Private Functionality

        protected override void SetThisContent()
        {
            Grid grid_main = new Grid();
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });

            ////////
            // Id
            m_textBlock_id = new TextBlock() { VerticalAlignment = VerticalAlignment.Center };
            Label label_id = new Label() { Content = "Id: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_id = new Grid();
            grid_id.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_id.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_id.SetRowColumn(m_textBlock_id, 0, 1);
            grid_id.SetRowColumn(label_id, 0, 0);
            grid_main.SetRowColumn(grid_id, 0, 0);

            ////////
            // Name
            m_textBox_name = new TextBox() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_name = new ValidatorPanel(m_textBox_name, TextBox.TextProperty, new Validate_StringIsNotNullOrEmpty());
            Label label_name = new Label() { Content = "Name: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_name = new Grid();
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.SetRowColumn(validator_name, 1, 0);
            grid_name.SetRowColumn(label_name, 0, 0);
            grid_main.SetRowColumn(grid_name, 1, 0);

            ////////
            // Order
            m_integerUpDown_order = new IntegerUpDown() { VerticalAlignment = VerticalAlignment.Center };
            Label label_order = new Label() { Content = "Order: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_order = new Grid();
            grid_order.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_order.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_order.SetRowColumn(m_integerUpDown_order, 1, 0);
            grid_order.SetRowColumn(label_order, 0, 0);
            grid_main.SetRowColumn(grid_order, 2, 0);

            ////////
            // Width
            m_doubleUpDown_width = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_width = new ValidatorPanel(m_doubleUpDown_width, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_width = new Label() { Content = "Width: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_width = new Grid();
            grid_width.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_width.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_width.SetRowColumn(validator_width, 1, 0);
            grid_width.SetRowColumn(label_width, 0, 0);
            grid_main.SetRowColumn(grid_width, 3, 0);

            ////////
            // Height
            m_doubleUpDown_height = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_height = new ValidatorPanel(m_doubleUpDown_height, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_height = new Label() { Content = "Height: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_height = new Grid();
            grid_height.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_height.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_height.SetRowColumn(validator_height, 1, 0);
            grid_height.SetRowColumn(label_height, 0, 0);
            grid_main.SetRowColumn(grid_height, 4, 0);

            ////////
            // FIN
            ThisContent = new ActivatableContent() { Content = grid_main, FirstFocus = m_textBox_name, Validators = new ValidatorBase[] {
                validator_name,
                validator_width,
                validator_height
            }};
        }

        protected override bool DataIsNull()
        {
            return m_level == null;
        }

        protected override int AddNewData()
        {
            m_level = DataManager.Generate<Level>();
            m_level.Name = m_textBox_name.Text;
            m_level.Order = m_integerUpDown_order.Value;
            m_level.Width = m_doubleUpDown_width.Value.Value;
            m_level.Height = m_doubleUpDown_height.Value.Value;

            DataManager.Levels.Add(m_level);

            return m_level.Id;
        }

        protected override int UpdateExistingData()
        {
            m_level.Name = m_textBox_name.Text;
            m_level.Order = m_integerUpDown_order.Value;
            m_level.Width = m_doubleUpDown_width.Value.Value;
            m_level.Height = m_doubleUpDown_height.Value.Value;

            return m_level.Id;
        }

        protected override void RevertNewData()
        {
            m_textBox_name.Text = string.Empty;
            m_integerUpDown_order.Value = null;
            m_doubleUpDown_width.Value = null;
            m_doubleUpDown_height.Value = null;
        }

        protected override void RevertExistingData()
        {
            m_textBox_name.Text = m_level.Name;
            m_integerUpDown_order.Value = m_level.Order;
            m_doubleUpDown_width.Value = m_level.Width;
            m_doubleUpDown_height.Value = m_level.Height;
        }

        #endregion

        #endregion
    }
}
