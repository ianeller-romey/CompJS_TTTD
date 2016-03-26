using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

using Xceed.Wpf.Toolkit;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Controls.Validation;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.EditData
{
    public class UserControl_LevelLayoutDataEditor : UserControl_EditData
    {
        #region MEMBER FIELDS

        private LevelLayout m_levelLayout;

        private TextBlock m_textBlock_id;
        //private TextBox m_textBox_name;
        private Grid m_grid_data;
        private ObservableCollection<UserControl_LevelLayoutData> m_userControls_levelLayoutData = new ObservableCollection<UserControl_LevelLayoutData>();
        //private DoubleUpDown m_doubleUpDown_x;
        //private DoubleUpDown m_doubleUpDown_y;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER CLASSES

        private abstract class UserControl_LevelLayoutData : UserControl, INotifyPropertyChanged
        {
            #region MEMBER FIELDS

            public enum DataType
            {
                String,
                Int,
                Double,
                Bool
            };

            protected string m_dataName;
            protected object m_dataValue;

            #endregion


            #region MEMBER PROPERTIES

            public string DataName
            {
                get { return m_dataName; }
                set
                {
                    if (m_dataName != value)
                    {
                        m_dataName = value;
                        NotifyPropertyChanged("DataName");
                    }
                }
            }

            public object DataValue
            {
                get { return m_dataValue; }
                set
                {
                    if (m_dataValue != value)
                    {
                        m_dataValue = value;
                        NotifyPropertyChanged("DataValue");
                    }
                }
            }

            public abstract DataType DataValueType
            {
                get;
            }


            #endregion


            #region MEMBER EVENTS

            public event PropertyChangedEventHandler PropertyChanged;

            #endregion


            #region MEMBER METHODS

            #region Public Functionality

            public UserControl_LevelLayoutData(string dataName)
            {
                CreateControls();
                DataName = dataName;
            }

            #endregion


            #region Private Functionality

            private void CreateControls()
            {
                Grid grid_main = new Grid();
                grid_main.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(33.3, GridUnitType.Star) });
                grid_main.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(100.0, GridUnitType.Star) });

                TextBox textBox_dataName = new TextBox();
                Binding binding_textBox_dataName =
                    new Binding("DataName")
                    {
                        Source = this,
                        Mode = BindingMode.TwoWay,
                        UpdateSourceTrigger = UpdateSourceTrigger.PropertyChanged
                    };
                textBox_dataName.SetBinding(TextBox.TextProperty, binding_textBox_dataName);

                grid_main.SetRowColumn(textBox_dataName, 0, 0);

                Content = grid_main;
            }

            #endregion


            #region Protected Functionality

            protected void NotifyPropertyChanged(string name)
            {
                if (PropertyChanged != null && !string.IsNullOrEmpty(name))
                    PropertyChanged(this, new PropertyChangedEventArgs(name));
            }

            #endregion

            #endregion
        }

        private class UserControl_StringData : UserControl_LevelLayoutData
        {
            #region MEMBER FIELDS
            #endregion


            #region MEMBER PROPERTIES

            public override DataType DataValueType
            {
                get { return DataType.String; }
            }

            #endregion


            #region MEMBER METHODS

            #region Public Functionality

            public UserControl_StringData(string dataName, string dataValue) :
                base(dataName)
            {
                var grid_main = Content as Grid;
                if (grid_main != null)
                {

                    var control_dataValue = new TextBox();
                    Binding binding_control_dataValue =
                        new Binding("DataValue")
                        {
                            Source = this,
                            Mode = BindingMode.TwoWay,
                            UpdateSourceTrigger = UpdateSourceTrigger.PropertyChanged
                        };
                    control_dataValue.SetBinding(TextBox.TextProperty, binding_control_dataValue);

                    grid_main.SetRowColumn(control_dataValue, 0, 1);
                }

                DataValue = dataValue;
            }

            #endregion

            #endregion
        }

        private class UserControl_IntData : UserControl_LevelLayoutData
        {
            #region MEMBER FIELDS
            #endregion


            #region MEMBER PROPERTIES

            public override DataType DataValueType
            {
                get { return DataType.Int; }
            }

            #endregion


            #region MEMBER METHODS

            #region Public Functionality

            public UserControl_IntData(string dataName, int dataValue) :
                base(dataName)
            {
                var grid_main = Content as Grid;
                if (grid_main != null)
                {

                    var control_dataValue = new IntegerUpDown();
                    Binding binding_control_dataValue =
                        new Binding("DataValue")
                        {
                            Source = this,
                            Mode = BindingMode.TwoWay
                        };
                    control_dataValue.SetBinding(IntegerUpDown.ValueProperty, binding_control_dataValue);

                    grid_main.SetRowColumn(control_dataValue, 0, 1);
                }

                DataValue = dataValue;
            }

            #endregion

            #endregion
        }

        private class UserControl_DoubleData : UserControl_LevelLayoutData
        {
            #region MEMBER FIELDS
            #endregion


            #region MEMBER PROPERTIES

            public override DataType DataValueType
            {
                get { return DataType.Double; }
            }

            #endregion


            #region MEMBER METHODS

            #region Public Functionality

            public UserControl_DoubleData(string dataName, double dataValue) :
                base(dataName)
            {
                var grid_main = Content as Grid;
                if (grid_main != null)
                {

                    var control_dataValue = new DoubleUpDown();
                    Binding binding_control_dataValue =
                        new Binding("DataValue")
                        {
                            Source = this,
                            Mode = BindingMode.TwoWay
                        };
                    control_dataValue.SetBinding(DoubleUpDown.ValueProperty, binding_control_dataValue);

                    grid_main.SetRowColumn(control_dataValue, 0, 1);
                }

                DataValue = dataValue;
            }

            #endregion

            #endregion
        }

        private class UserControl_BoolData : UserControl_LevelLayoutData
        {
            #region MEMBER FIELDS
            #endregion


            #region MEMBER PROPERTIES

            public override DataType DataValueType
            {
                get { return DataType.Bool; }
            }

            #endregion


            #region MEMBER METHODS

            #region Public Functionality

            public UserControl_BoolData(string dataName, bool dataValue) :
                base(dataName)
            {
                var grid_main = Content as Grid;
                if (grid_main != null)
                {

                    var control_dataValue = new CheckBox() { VerticalAlignment = System.Windows.VerticalAlignment.Center, VerticalContentAlignment = System.Windows.VerticalAlignment.Center };
                    Binding binding_control_dataValue =
                        new Binding("DataValue")
                        {
                            Source = this,
                            Mode = BindingMode.TwoWay
                        };
                    control_dataValue.SetBinding(CheckBox.IsCheckedProperty, binding_control_dataValue);

                    grid_main.SetRowColumn(control_dataValue, 0, 1);
                }

                DataValue = dataValue;
            }

            #endregion

            #endregion
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_LevelLayoutDataEditor(LevelLayout levelLayout) :
            base("Level Layout", true)
        {
            m_levelLayout = levelLayout;

            if (DataIsNull())
            {
                throw new ArgumentNullException("levelLayout");
            }
            else
            {
                m_textBlock_id.Text = m_levelLayout.Id.ToString();
                //m_textBox_name.Text = m_levelLayout.Name;
                CreateControlsFromData(m_levelLayout.Data);
                //m_doubleUpDown_x.Value = m_levelLayout.X;
                //m_doubleUpDown_x.Value = m_levelLayout.Y;   
            }
        }

        #endregion


        #region Private Functionality

        protected override void SetThisContent()
        {
            Grid grid_main = new Grid();
            grid_main.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(100.0, GridUnitType.Star) });
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
            /*m_textBox_name = new TextBox() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_name = new ValidatorPanel(m_textBox_name, TextBox.TextProperty, new Validate_StringIsNotNullOrEmpty());
            Label label_name = new Label() { Content = "Name: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_name = new Grid();
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.SetRowColumn(validator_name, 1, 0);
            grid_name.SetRowColumn(label_name, 0, 0);
            grid_main.SetRowColumn(grid_name, 1, 0);*/

            ////////
            // X
            /*m_doubleUpDown_x = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_x = new ValidatorPanel(m_doubleUpDown_x, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_x = new Label() { Content = "X: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_x = new Grid();
            grid_x.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_x.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_x.SetRowColumn(validator_x, 1, 0);
            grid_x.SetRowColumn(label_x, 0, 0);
            grid_main.SetRowColumn(grid_x, 2, 0);*/

            ////////
            // Y
            /*m_doubleUpDown_y = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_y = new ValidatorPanel(m_doubleUpDown_y, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_y = new Label() { Content = "Y: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_y = new Grid();
            grid_y.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_y.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_y.SetRowColumn(validator_y, 1, 0);
            grid_y.SetRowColumn(label_y, 0, 0);
            grid_main.SetRowColumn(grid_y, 3, 0);*/

            ////////
            // Data
            m_grid_data = new Grid();
            m_grid_data.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(100.0, GridUnitType.Star) });
            Grid grid_newData = new Grid();
            Label label_data = new Label() { Content = "Data: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            var enumNames = Enum.GetNames(typeof(UserControl_LevelLayoutData.DataType));
            var enumValues = Enum.GetValues(typeof(UserControl_LevelLayoutData.DataType)).OfType<UserControl_LevelLayoutData.DataType>().ToArray();
            for(int i = 0, j = enumNames.Length, percent = 100 / j; i < j; ++i)
            {
                var enumName = enumNames[i];
                var enumValue = enumValues[i];

                grid_newData.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(percent, GridUnitType.Star) });
                Button button_addNewData = new Button() { Content = "+ " + enumName };
                button_addNewData.Click += (x,y) =>
                    {
                        var ev = enumValue;
                        AddLevelLayoutDataControl(ev);
                    };
                grid_newData.SetRowColumn(button_addNewData, 0, i);
            }
            Grid grid_data = new Grid();
            grid_data.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(100.0, GridUnitType.Star) });
            grid_data.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_data.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_data.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_data.SetRowColumn(m_grid_data, 2, 0);
            grid_data.SetRowColumn(grid_newData, 1, 0);
            grid_data.SetRowColumn(label_data, 0, 0);
            grid_main.SetRowColumn(grid_data, 4, 0);

            ////////
            // FIN
            ThisContent = new ActivatableContent() { Content = grid_main, FirstFocus = m_grid_data };//, FirstFocus = m_textBox_name, Validators = new ValidatorBase[] {
                //validator_name,
                //validator_x,
                //validator_y
            //}};
        }

        protected override bool DataIsNull()
        {
            return m_levelLayout == null;
        }

        protected override int AddNewData()
        {
            m_levelLayout = DataManager.Generate<LevelLayout>();
            //m_levelLayout.Name = m_textBox_name.Text;
            m_levelLayout.Data.Clear();
            m_levelLayout.Data.AddRange(CreateDataFromControls());
            //m_levelLayout.X = m_doubleUpDown_x.Value.Value;
            //m_levelLayout.Y = m_doubleUpDown_y.Value.Value;

            DataManager.LevelLayouts.Add(m_levelLayout);

            return m_levelLayout.Id;
        }

        protected override int UpdateExistingData()
        {
            //m_levelLayout.Name = m_textBox_name.Text;            
            m_levelLayout.Data.Clear();
            m_levelLayout.Data.AddRange(CreateDataFromControls());
            //m_levelLayout.X = m_doubleUpDown_x.Value.Value;
            //m_levelLayout.Y = m_doubleUpDown_y.Value.Value;

            return m_levelLayout.Id;
        }

        protected override void RevertNewData()
        {
            //m_textBox_name.Text = string.Empty;
            m_userControls_levelLayoutData.Clear();
            m_grid_data.Children.Clear();
            //m_doubleUpDown_x.Value = null;
           // m_doubleUpDown_y.Value = null;
        }

        protected override void RevertExistingData()
        {
            //m_textBox_name.Text = m_levelLayout.Name;
            m_userControls_levelLayoutData.Clear();
            m_grid_data.Children.Clear();
            CreateControlsFromData(m_levelLayout.Data);
            //m_doubleUpDown_x.Value = m_levelLayout.X;
            //m_doubleUpDown_y.Value = m_levelLayout.Y;
        }

        private void CreateControlsFromData(IEnumerable<KeyValuePair<string, object>> data)
        {
            if (data == null)
                return;

            foreach (var keyValue in data)
            {
                AddLevelLayoutDataControl(CreateLevelLayoutDataControl(keyValue.Key, keyValue.Value));
            }
        }

        private IEnumerable<KeyValuePair<string, object>> CreateDataFromControls()
        {
            var data = new List<KeyValuePair<string, object>>();
            foreach (var control in m_userControls_levelLayoutData)
                data.Add(new KeyValuePair<string,object>(control.DataName, control.DataValue));

            return data;
        }

        private void AddLevelLayoutDataControl(UserControl_LevelLayoutData.DataType dataValueType)
        {
            var userControl_levelLayoutData = CreateLevelLayoutDataControl(dataValueType);
            AddLevelLayoutDataControlGrid(userControl_levelLayoutData);
        }

        private void AddLevelLayoutDataControl(string dataName, string dataValue)
        {
            var userControl_levelLayoutData = new UserControl_StringData(dataName, dataValue);
            AddLevelLayoutDataControlGrid(userControl_levelLayoutData);
        }

        private void AddLevelLayoutDataControl(string dataName, int dataValue)
        {
            var userControl_levelLayoutData = new UserControl_IntData(dataName, dataValue);
            AddLevelLayoutDataControlGrid(userControl_levelLayoutData);
        }

        private void AddLevelLayoutDataControl(string dataName, double dataValue)
        {
            var userControl_levelLayoutData = new UserControl_DoubleData(dataName, dataValue);
            AddLevelLayoutDataControlGrid(userControl_levelLayoutData);
        }

        private void AddLevelLayoutDataControl(string dataName, bool dataValue)
        {
            var userControl_levelLayoutData = new UserControl_BoolData(dataName, dataValue);
            AddLevelLayoutDataControlGrid(userControl_levelLayoutData);
        }

        private void AddLevelLayoutDataControl(UserControl_LevelLayoutData userControl_levelLayoutData)
        {
            AddLevelLayoutDataControlGrid(userControl_levelLayoutData);
        }

        private void AddLevelLayoutDataControlGrid(UserControl_LevelLayoutData userControl_levelLayoutData)
        {
            Grid grid = new Grid();
            grid.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(100.0, GridUnitType.Star) });
            grid.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            Button button_remove = new Button() { Content = "-" };
            button_remove.Click += (x, y) =>
            {
                var uc = userControl_levelLayoutData;
                var button = x as Button;
                if (x != null && x == button_remove)
                {
                    m_grid_data.Children.Remove(grid);
                    m_userControls_levelLayoutData.Remove(uc);
                }
            };
            grid.SetRowColumn(userControl_levelLayoutData, 0, 0);
            grid.SetRowColumn(button_remove, 0, 1);
            m_grid_data.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_data.SetRowColumn(grid, m_grid_data.RowDefinitions.Count - 1, 0);
            m_userControls_levelLayoutData.Add(userControl_levelLayoutData);
        }

        private UserControl_LevelLayoutData CreateLevelLayoutDataControl(UserControl_LevelLayoutData.DataType dataValueType)
        {
            UserControl_LevelLayoutData control = null;
            switch (dataValueType)
            {
                case UserControl_LevelLayoutData.DataType.String:
                    control = new UserControl_StringData("New String Data", string.Empty);
                    break;
                case UserControl_LevelLayoutData.DataType.Int:
                    control = new UserControl_IntData("New Int Data", 0);
                    break;
                case UserControl_LevelLayoutData.DataType.Double:
                    control = new UserControl_DoubleData("New Double Data", 0.0);
                    break;
                case UserControl_LevelLayoutData.DataType.Bool:
                    control = new UserControl_BoolData("New Bool Data", false);
                    break;
            }
            return control;
        }

        private UserControl_LevelLayoutData CreateLevelLayoutDataControl(string dataName, object dataValue)
        {
            UserControl_LevelLayoutData control = null;
            var dataValueType = dataValue.GetType();
            if (dataValueType == typeof(string))
                control = new UserControl_StringData(dataName, Convert.ToString(dataValue));
            else if (dataValueType == typeof(int) || dataValueType == typeof(long))
                control = new UserControl_IntData(dataName, Convert.ToInt32(dataValue));
            else if (dataValueType == typeof(float) || dataValueType == typeof(double))
                control = new UserControl_DoubleData(dataName, Convert.ToDouble(dataValue));
            else if (dataValueType == typeof(bool))
                control = new UserControl_BoolData(dataName, Convert.ToBoolean(dataValue));
            return control;
        }

        #endregion

        #endregion
    }
}
