using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Controls.Validation;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.EditData
{
    public class UserControl_BehaviorInstanceDefinition : UserControl_EditData
    {
        #region MEMBER FIELDS

        private static readonly Regex m_regex_behaviorConstructor = new Regex("\\(\"setBehaviorConstructor\", \"(?<behaviorConstructorName>\\w+)\", namespace\\.(?<behaviorConstructorFunction>\\w+)\\);", RegexOptions.Compiled);

        private BehaviorInstanceDefinition m_behaviorInstanceDefinition;

        private TextBlock m_textBlock_id;
        private TextBox m_textBox_name;
        private ComboBox m_comboBox_entityInstanceDefinition;
        private TextBox m_textBox_behaviorFile;
        private TextBlock m_textBlock_behaviorConstructor;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_BehaviorInstanceDefinition(BehaviorInstanceDefinition behaviorInstanceDefinition) :
            base("Behavior Instance Definition", false)
        {
            m_behaviorInstanceDefinition = behaviorInstanceDefinition;

            if (DataIsNull())
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
                m_comboBox_entityInstanceDefinition.SelectedItem = null;
                m_textBox_behaviorFile.Text = string.Empty;
                m_textBlock_behaviorConstructor.Text = string.Empty;
            }
            else
            {
                m_textBlock_id.Text = m_behaviorInstanceDefinition.Id.ToString();
                m_textBox_name.Text = m_behaviorInstanceDefinition.Name;
                m_comboBox_entityInstanceDefinition.SelectedItem = m_behaviorInstanceDefinition.EntityInstanceDefinition;
                m_textBox_behaviorFile.Text = m_behaviorInstanceDefinition.BehaviorFile;
                m_textBlock_behaviorConstructor.Text = m_behaviorInstanceDefinition.BehaviorConstructor;
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
            m_textBlock_id = new TextBlock() { VerticalAlignment = VerticalAlignment.Center, Text = (m_behaviorInstanceDefinition != null) ? m_behaviorInstanceDefinition.Id.ToString() : "N/A" };
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
            // EntityInstanceDefinition
            CollectionViewSource collectionViewSource_entityInstanceDefinition =
                new CollectionViewSource()
                {
                    Source = DataManager.EntityInstanceDefinitions
                };
            m_comboBox_entityInstanceDefinition =
                new ComboBox()
                {
                    DisplayMemberPath = "Name",
                    IsTextSearchEnabled = true
                };
            m_comboBox_entityInstanceDefinition.SetBinding(ItemsControl.ItemsSourceProperty, new Binding() { Source = collectionViewSource_entityInstanceDefinition });
            ValidatorPanel validator_entityInstanceDefinition = new ValidatorPanel(m_comboBox_entityInstanceDefinition, ComboBox.SelectedItemProperty, new Validate_NotNull());

            Label label_entityInstanceDefinition = new Label() { Content = "Entity Instance: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_entityInstanceDefinition = new Grid();
            grid_entityInstanceDefinition.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_entityInstanceDefinition.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_entityInstanceDefinition.SetRowColumn(validator_entityInstanceDefinition, 1, 0);
            grid_entityInstanceDefinition.SetRowColumn(label_entityInstanceDefinition, 0, 0);
            grid_main.SetRowColumn(grid_entityInstanceDefinition, 2, 0);

            ////////
            // Behavior File
            Button button_behaviorFile = new Button() { Content = " ... " };
            button_behaviorFile.Click += (x, y) => { SelectBehaviorFile(); };
            m_textBox_behaviorFile = new TextBox() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_behaviorFile = new ValidatorPanel(m_textBox_behaviorFile, TextBox.TextProperty, new Validate_StringIsNotNullOrEmpty());
            Label label_behaviorFile = new Label() { Content = "Behavior File: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_behaviorFile = new Grid();
            grid_behaviorFile.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_behaviorFile.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_behaviorFile.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(100.0, GridUnitType.Star) });
            grid_behaviorFile.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_behaviorFile.SetRowColumn(button_behaviorFile, 1, 1);
            grid_behaviorFile.SetRowColumn(validator_behaviorFile, 1, 0);
            Grid.SetColumnSpan(label_behaviorFile, 2);
            grid_behaviorFile.SetRowColumn(label_behaviorFile, 0, 0);
            grid_main.SetRowColumn(grid_behaviorFile, 3, 0);

            ////////
            // Behavior Constructor
            m_textBlock_behaviorConstructor = new TextBlock() { VerticalAlignment = VerticalAlignment.Center };
            Label label_behaviorConstructor = new Label() { Content = "Behavior Constructor: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_behaviorConstructor = new ValidatorPanel(m_textBlock_behaviorConstructor, TextBlock.TextProperty, new Validate_StringIsNotNullOrEmpty());
            Grid grid_behaviorConstructor = new Grid();
            grid_behaviorConstructor.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_behaviorConstructor.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_behaviorConstructor.SetRowColumn(validator_behaviorConstructor, 1, 0);
            grid_behaviorConstructor.SetRowColumn(label_behaviorConstructor, 0, 0);
            grid_main.SetRowColumn(grid_behaviorConstructor, 4, 0);

            ////////
            // FIN
            ThisContent = new ActivatableContent() { Content = grid_main, FirstFocus = m_textBox_name, Validators = new ValidatorBase[] {
                validator_name,
                validator_entityInstanceDefinition,
                validator_behaviorFile,
                validator_behaviorConstructor
            }};
        }

        protected override bool DataIsNull()
        {
            return m_behaviorInstanceDefinition == null;
        }

        protected override int AddNewData()
        {
            m_behaviorInstanceDefinition = DataManager.Generate<BehaviorInstanceDefinition>();
            m_behaviorInstanceDefinition.Name = m_textBox_name.Text;
            m_behaviorInstanceDefinition.EntityInstanceDefinition = m_comboBox_entityInstanceDefinition.SelectedItem as EntityInstanceDefinition;
            m_behaviorInstanceDefinition.BehaviorFile = m_textBox_behaviorFile.Text;
            m_behaviorInstanceDefinition.BehaviorConstructor = m_textBlock_behaviorConstructor.Text;

            DataManager.BehaviorInstanceDefinitions.Add(m_behaviorInstanceDefinition);

            return m_behaviorInstanceDefinition.Id;
        }

        protected override int UpdateExistingData()
        {
            m_behaviorInstanceDefinition.Name = m_textBox_name.Text;
            m_behaviorInstanceDefinition.EntityInstanceDefinition = m_comboBox_entityInstanceDefinition.SelectedItem as EntityInstanceDefinition;
            m_behaviorInstanceDefinition.BehaviorFile = m_textBox_behaviorFile.Text;
            m_behaviorInstanceDefinition.BehaviorConstructor = m_textBlock_behaviorConstructor.Text;

            return m_behaviorInstanceDefinition.Id;
        }

        protected override void RevertNewData()
        {
            m_textBox_name.Text = string.Empty;
            m_comboBox_entityInstanceDefinition.SelectedValue = null;
            m_textBox_behaviorFile.Text = string.Empty;
            m_textBlock_behaviorConstructor.Text = string.Empty;
        }

        protected override void RevertExistingData()
        {
            m_textBox_name.Text = m_behaviorInstanceDefinition.Name;
            m_comboBox_entityInstanceDefinition.SelectedValue = m_behaviorInstanceDefinition.EntityInstanceDefinition;
            m_textBox_behaviorFile.Text = m_behaviorInstanceDefinition.BehaviorFile;
            m_textBlock_behaviorConstructor.Text = m_behaviorInstanceDefinition.BehaviorConstructor;
        }

        private void SelectBehaviorFile()
        {
            Window_OpenFile window = 
                new Window_OpenFile("Select Behavior File", 
                    (m_behaviorInstanceDefinition != null) ? m_behaviorInstanceDefinition.BehaviorFile : null, 
                    new[] { new Window_OpenFile.Filter("JavaScript Files (.js)", "*.js") });
            window.ShowDialog();
            if (window.Accepted)
            {
                m_textBox_behaviorFile.Text = window.FileName;
                ParseBehaviorConstructorFromFile(window.FileName);
            }
        }

        private void ParseBehaviorConstructorFromFile(string behaviorFile)
        {
            if (File.Exists(behaviorFile))
            {
                string behaviorFileText = File.ReadAllText(behaviorFile);
                Match match = m_regex_behaviorConstructor.Match(behaviorFileText);
                if (match != null)
                {
                    string behaviorConstructorName = match.Groups["behaviorConstructorName"].Value,
                           behaviorConstructorFunction = match.Groups["behaviorConstructorFunction"].Value;
                    if (behaviorConstructorName == behaviorConstructorFunction)
                    {
                        m_textBlock_behaviorConstructor.Text = behaviorConstructorName;
                    }
                }
            }
        }

        #endregion

        #endregion
    }
}
