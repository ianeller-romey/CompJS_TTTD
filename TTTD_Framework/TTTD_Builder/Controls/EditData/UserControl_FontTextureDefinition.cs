using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

using Xceed.Wpf.Toolkit;
using Xceed.Wpf.Toolkit.Zoombox;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Controls.Validation;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.EditData
{
    public class UserControl_FontTextureDefinition : UserControl_EditData
    {
        #region MEMBER FIELDS

        private FontTextureDefinition m_fontTextureDefinition;
        
        private TextBlock m_textBlock_id;
        private TextBox m_textBox_name;
        private TextBox m_textBox_texture;
        private DoubleUpDown m_doubleUpDown_textureWidth;
        private DoubleUpDown m_doubleUpDown_startTop;
        private DoubleUpDown m_doubleUpDown_startLeft;
        private DoubleUpDown m_doubleUpDown_characterWidth;
        private DoubleUpDown m_doubleUpDown_characterHeight;

        private Image m_image;
        private UserControl_CanvasWithRectangle m_canvasWithRectangle;
        private Zoombox m_zoomBox;
        private const double c_defaultWidthHeight = 32.0;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER CLASSES

        private class BitmapSourceConverter : IValueConverter
        {
            #region MEMBER FIELDS
            #endregion


            #region MEMBER METHODS

            #region Public Functionality

            public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                if(value == null)
                    return null;

                string imageFile = value.ToString();
                if (!File.Exists(imageFile))
                    return null;

                Uri uri;
                try
                {
                    uri = new Uri(imageFile);
                }
                catch (Exception)
                {
                    return null;
                }

                var bitmapImage = new BitmapImage(new Uri(imageFile));
                return bitmapImage;
            }

            public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                throw new NotImplementedException();
            }

            #endregion

            #endregion
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_FontTextureDefinition(FontTextureDefinition fontTextureDefinition) :
            base("Font Texture Definition", false)
        {
            m_fontTextureDefinition = fontTextureDefinition;

            if (DataIsNull())
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
                m_textBox_texture.Text = string.Empty;
                m_doubleUpDown_textureWidth.Value = null;
                m_doubleUpDown_startTop.Value = null;
                m_doubleUpDown_startLeft.Value = null;
                m_doubleUpDown_characterWidth.Value = null;
                m_doubleUpDown_characterHeight.Value = null;
            }
            else
            {
                m_textBlock_id.Text = m_fontTextureDefinition.Id.ToString();
                m_textBox_name.Text = m_fontTextureDefinition.Name;
                m_textBox_texture.Text = m_fontTextureDefinition.Texture;

                CreateCanvasControls();

                m_doubleUpDown_textureWidth.Value = m_fontTextureDefinition.TextureWidth;
                m_doubleUpDown_startTop.Value = m_fontTextureDefinition.StartTop;
                m_doubleUpDown_startLeft.Value = m_fontTextureDefinition.StartLeft;
                m_doubleUpDown_characterWidth.Value = m_fontTextureDefinition.CharacterWidth;
                m_doubleUpDown_characterHeight.Value = m_fontTextureDefinition.CharacterHeight;
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

            Grid grid_sub = new Grid();
            grid_sub.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_sub.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(100.0, GridUnitType.Star) });
            grid_main.SetRowColumn(grid_sub, 3, 0);

            Grid grid_left = new Grid();
            grid_left.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_left.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_left.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_left.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_left.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_sub.SetRowColumn(grid_left, 0, 0);

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
            // Texture
            Button button_texture = new Button() { Content = " ... " };
            button_texture.Click += (x, y) => { SelectTextureFile(); };
            m_textBox_texture = new TextBox() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_texture = new ValidatorPanel(m_textBox_texture, TextBox.TextProperty, new Validate_StringIsNotNullOrEmpty());
            Label label_texture = new Label() { Content = "Texture File: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_texture = new Grid();
            grid_texture.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texture.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texture.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(100.0, GridUnitType.Star) });
            grid_texture.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_texture.SetRowColumn(button_texture, 1, 1);
            grid_texture.SetRowColumn(validator_texture, 1, 0);
            Grid.SetColumnSpan(label_texture, 2);
            grid_texture.SetRowColumn(label_texture, 0, 0);
            grid_main.SetRowColumn(grid_texture, 2, 0);

            ////////
            // TextureWidth
            m_doubleUpDown_textureWidth = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center, IsEnabled = false };
            ValidatorPanel validator_textureWidth = new ValidatorPanel(m_doubleUpDown_textureWidth, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_width = new Label() { Content = "Texture Width: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_width = new Grid();
            grid_width.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_width.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_width.SetRowColumn(validator_textureWidth, 1, 0);
            grid_width.SetRowColumn(label_width, 0, 0);
            grid_left.SetRowColumn(grid_width, 0, 0);

            ////////
            // StartTop
            m_doubleUpDown_startTop = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_startTop = new ValidatorPanel(m_doubleUpDown_startTop, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_height = new Label() { Content = "Start Top: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_height = new Grid();
            grid_height.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_height.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_height.SetRowColumn(validator_startTop, 1, 0);
            grid_height.SetRowColumn(label_height, 0, 0);
            grid_left.SetRowColumn(grid_height, 1, 0);

            ////////
            // StartLeft
            m_doubleUpDown_startLeft = new DoubleUpDown() { Increment = .005, VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_startLeft = new ValidatorPanel(m_doubleUpDown_startLeft, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_texCoordTop = new Label() { Content = "Start Left: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_texCoordTop = new Grid();
            grid_texCoordTop.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordTop.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordTop.SetRowColumn(validator_startLeft, 1, 0);
            grid_texCoordTop.SetRowColumn(label_texCoordTop, 0, 0);
            grid_left.SetRowColumn(grid_texCoordTop, 2, 0);

            ////////
            // CharacterWidth
            m_doubleUpDown_characterWidth = new DoubleUpDown() { Increment = .005, VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_characterWidth = new ValidatorPanel(m_doubleUpDown_characterWidth, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_texCoordRight = new Label() { Content = "Character Width: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_texCoordRight = new Grid();
            grid_texCoordRight.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordRight.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordRight.SetRowColumn(validator_characterWidth, 1, 0);
            grid_texCoordRight.SetRowColumn(label_texCoordRight, 0, 0);
            grid_left.SetRowColumn(grid_texCoordRight, 3, 0);

            ////////
            // CharacterHeight
            m_doubleUpDown_characterHeight = new DoubleUpDown() { Increment = .005, VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_characterHeight = new ValidatorPanel(m_doubleUpDown_characterHeight, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_texCoordBottom = new Label() { Content = "Character Height: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_texCoordBottom = new Grid();
            grid_texCoordBottom.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordBottom.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordBottom.SetRowColumn(validator_characterHeight, 1, 0);
            grid_texCoordBottom.SetRowColumn(label_texCoordBottom, 0, 0);
            grid_left.SetRowColumn(grid_texCoordBottom, 4, 0);

            ////////
            // Canvas
            m_image = new Image() { Stretch = System.Windows.Media.Stretch.None };
            Binding binding_image_imageSource =
                new Binding("Text")
                {
                    Source = m_textBox_texture,
                    Mode = BindingMode.OneWay,
                    UpdateSourceTrigger = System.Windows.Data.UpdateSourceTrigger.PropertyChanged,
                    Converter = new BitmapSourceConverter()
                };
            m_image.SetBinding(Image.SourceProperty, binding_image_imageSource);
            m_canvasWithRectangle = new UserControl_CanvasWithRectangle(new[] { m_image }) { Width = 500, Height = 500 };
            m_zoomBox = 
                new Zoombox() 
                {
                    Content = m_canvasWithRectangle, 
                    Background = Brushes.Black,
                    Width = m_canvasWithRectangle.Width,
                    Height = m_canvasWithRectangle.Height,
                    Margin = new Thickness(5.0),
                    HorizontalAlignment = System.Windows.HorizontalAlignment.Center,
                    VerticalAlignment = System.Windows.VerticalAlignment.Center,
                    MinScale = 1.0,
                    MaxScale = 100
                };
            grid_sub.SetRowColumn(m_zoomBox, 0, 1);

            ////////
            // FIN
            ThisContent = new ActivatableContent() { Content = grid_main, FirstFocus = m_textBox_name, Validators = new ValidatorBase[] {
                validator_name,
                validator_texture,
                validator_textureWidth,
                validator_startTop,
                validator_startLeft,
                validator_characterWidth,
                validator_characterHeight
            }};
        }

        protected override bool DataIsNull()
        {
            return m_fontTextureDefinition == null;
        }

        protected override int AddNewData()
        {
            m_fontTextureDefinition = DataManager.Generate<FontTextureDefinition>();
            m_fontTextureDefinition.Name = m_textBox_name.Text;
            m_fontTextureDefinition.Texture = m_textBox_texture.Text;
            m_fontTextureDefinition.TextureWidth = m_doubleUpDown_textureWidth.Value.Value;
            m_fontTextureDefinition.StartTop = m_doubleUpDown_startTop.Value.Value;
            m_fontTextureDefinition.StartLeft = m_doubleUpDown_startLeft.Value.Value;
            m_fontTextureDefinition.CharacterWidth = m_doubleUpDown_characterWidth.Value.Value;
            m_fontTextureDefinition.CharacterHeight = m_doubleUpDown_characterHeight.Value.Value;

            DataManager.FontTextureDefinitions.Add(m_fontTextureDefinition);

            SaveTextureInformation(m_fontTextureDefinition.Texture);

            return m_fontTextureDefinition.Id;
        }

        protected override int UpdateExistingData()
        {
            m_fontTextureDefinition.Name = m_textBox_name.Text;
            m_fontTextureDefinition.Texture = m_textBox_texture.Text;
            m_fontTextureDefinition.TextureWidth = m_doubleUpDown_textureWidth.Value.Value;
            m_fontTextureDefinition.StartTop = m_doubleUpDown_startTop.Value.Value;
            m_fontTextureDefinition.StartLeft = m_doubleUpDown_startLeft.Value.Value;
            m_fontTextureDefinition.CharacterWidth = m_doubleUpDown_characterWidth.Value.Value;
            m_fontTextureDefinition.CharacterHeight = m_doubleUpDown_characterHeight.Value.Value;

            SaveTextureInformation(m_fontTextureDefinition.Texture);

            return m_fontTextureDefinition.Id;
        }

        protected override void RevertNewData()
        {
            m_textBox_name.Text = string.Empty;
            m_textBox_texture.Text = string.Empty;
            m_doubleUpDown_textureWidth.Value = null;
            m_doubleUpDown_startTop.Value = null;
            m_doubleUpDown_startLeft.Value = null;
            m_doubleUpDown_characterWidth.Value = null;
            m_doubleUpDown_characterHeight.Value = null;
        }

        protected override void RevertExistingData()
        {
            m_textBlock_id.Text = m_fontTextureDefinition.Id.ToString();
            m_textBox_name.Text = m_fontTextureDefinition.Name;
            m_textBox_texture.Text = m_fontTextureDefinition.Texture;
            m_doubleUpDown_textureWidth.Value = m_fontTextureDefinition.TextureWidth;
            m_doubleUpDown_startTop.Value = m_fontTextureDefinition.StartTop;
            m_doubleUpDown_startLeft.Value = m_fontTextureDefinition.StartLeft;
            m_doubleUpDown_characterWidth.Value = m_fontTextureDefinition.CharacterWidth;
            m_doubleUpDown_characterHeight.Value = m_fontTextureDefinition.CharacterHeight;
        }

        private void SaveTextureInformation(string textureFile)
        {
            var bitmapImage = new BitmapImage(new Uri(textureFile));

            TextureInformation textureInformation;
            if (!DataManager.TextureInformation.Any(x => x.Texture == textureFile))
            {
                textureInformation = DataManager.Generate<TextureInformation>();
                DataManager.TextureInformation.Add(textureInformation);
            }
            else
                textureInformation = DataManager.TextureInformation.First(x => x.Texture == textureFile);

            textureInformation.Name = System.IO.Path.GetFileNameWithoutExtension(textureFile);
            textureInformation.Texture = textureFile;
            textureInformation.TextureWidth = bitmapImage.PixelWidth;
            textureInformation.TextureHeight = bitmapImage.PixelHeight;
            textureInformation.StepX = 1.0 / textureInformation.TextureWidth;
            textureInformation.StepY = 1.0 / textureInformation.TextureHeight;
        }

        private void CreateCanvasControls()
        {
            m_canvasWithRectangle.ResetRectangle();

            Binding binding_rectangle_startTop =
                new Binding("Value")
                {
                    Source = m_doubleUpDown_startTop,
                    Mode = BindingMode.TwoWay,
                    UpdateSourceTrigger = System.Windows.Data.UpdateSourceTrigger.PropertyChanged
                };
            m_canvasWithRectangle.SizableRectangle.SetBinding(Canvas.TopProperty, binding_rectangle_startTop);

            Binding binding_rectangle_startLeft =
                new Binding("Value")
                {
                    Source = m_doubleUpDown_startLeft,
                    Mode = BindingMode.TwoWay,
                    UpdateSourceTrigger = System.Windows.Data.UpdateSourceTrigger.PropertyChanged
                };
            m_canvasWithRectangle.SizableRectangle.SetBinding(Canvas.LeftProperty, binding_rectangle_startLeft);

            Binding binding_rectangle_characterWidth =
                new Binding("Value")
                {
                    Source = m_doubleUpDown_characterWidth,
                    Mode = BindingMode.TwoWay,
                    UpdateSourceTrigger = System.Windows.Data.UpdateSourceTrigger.PropertyChanged
                };
            m_canvasWithRectangle.SizableRectangle.SetBinding(Rectangle.WidthProperty, binding_rectangle_characterWidth);

            Binding binding_rectangle_characterHeight =
                new Binding("Value")
                {
                    Source = m_doubleUpDown_characterHeight,
                    Mode = BindingMode.TwoWay,
                    UpdateSourceTrigger = System.Windows.Data.UpdateSourceTrigger.PropertyChanged
                };
            m_canvasWithRectangle.SizableRectangle.SetBinding(Rectangle.HeightProperty, binding_rectangle_characterHeight);

            m_canvasWithRectangle.SizableRectangle.Width = 
                m_canvasWithRectangle.SizableRectangle.Height = 
                    c_defaultWidthHeight;
        }

        private void SelectTextureFile()
        {
            Window_OpenFile window =
                new Window_OpenFile("Select Texture",
                    (m_fontTextureDefinition != null) ? m_fontTextureDefinition.Texture : null,
                    new[] { new Window_OpenFile.Filter("PNG Files (.png)", "*.png"), new Window_OpenFile.Filter("JPEG Files (.jpg)", "*.jpg") });
            window.ShowDialog();
            if (window.Accepted)
            {
                m_textBox_texture.Text = window.FileName;
                m_doubleUpDown_textureWidth.Value = ParseTextureWidth(m_textBox_texture.Text);
                CreateCanvasControls();
            }
        }

        private double? ParseTextureWidth(string textureFile)
        {
            if (textureFile == null)
                return null;

            if (!File.Exists(textureFile))
                return null;

            Uri uri;
            try
            {
                uri = new Uri(textureFile);
            }
            catch (Exception)
            {
                return null;
            }

            var bitmapImage = new BitmapImage(new Uri(textureFile));
            return bitmapImage.PixelWidth;
        }

        #endregion

        #endregion
    }
}
