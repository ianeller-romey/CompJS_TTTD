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
    public class UserControl_AnimationFrameDefinition : UserControl_EditData
    {
        #region MEMBER FIELDS

        private AnimationFrameDefinition m_animationFrameDefinition;
        
        private TextBlock m_textBlock_id;
        private TextBox m_textBox_name;
        private TextBox m_textBox_texture;
        private DoubleUpDown m_doubleUpDown_duration;
        private DoubleUpDown m_doubleUpDown_width;
        private DoubleUpDown m_doubleUpDown_height;
        private DoubleUpDown m_doubleUpDown_texCoordTop;
        private DoubleUpDown m_doubleUpDown_texCoordRight;
        private DoubleUpDown m_doubleUpDown_texCoordBottom;
        private DoubleUpDown m_doubleUpDown_texCoordLeft;

        private Image m_image;
        private UserControl_CanvasWithRectangle m_canvasWithRectangle;
        private Zoombox m_zoomBox;
        private const double c_defaultWidthHeight = 64.0;

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

        private class TextureCoordFromPixelConverter : IValueConverter
        {
            #region MEMBER FIELDS

            private Image m_image;

            #endregion


            #region MEMBER METHODS

            #region Public Functionality

            public TextureCoordFromPixelConverter(Image image)
            {
                m_image = image;
            }

            public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                if (value != null)
                {
                    var texCoord = (double)value;
                    var imageSource = m_image.Source as BitmapImage;
                    if (imageSource != null)
                    {
                        var pixelWidth = imageSource.PixelWidth;
                        return ((texCoord * (2 * pixelWidth)) - 1) / 2;
                    }
                }
                
                return 0;
            }

            public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                var pixel = (double)value;
                var imageSource = m_image.Source as BitmapImage;
                if (imageSource != null)
                {
                    var pixelWidth = imageSource.PixelWidth;
                    return ((2 * pixel) + 1) / (2 * pixelWidth);
                }

                return 0;
            }

            #endregion

            #endregion
        }

        private class TextureCoordFromLengthConverter : IValueConverter
        {
            #region MEMBER FIELDS

            public enum LengthType
            {
                Width,
                Height
            };

            private Image m_image;
            private Rectangle m_rect;

            #endregion


            #region MEMBER METHODS

            #region Public Functionality

            public TextureCoordFromLengthConverter(Image image, Rectangle rect)
            {
                m_image = image;
                m_rect = rect;
            }

            public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                if (value != null)
                {
                    var texCoord = (double)value;
                    var lengthType = (LengthType)parameter;
                    double pixelPlusLength = 0.0;
                    var imageSource = m_image.Source as BitmapImage;
                    if (imageSource != null)
                    {
                        var pixelWidth = imageSource.PixelWidth;
                        pixelPlusLength = ((texCoord * (2 * pixelWidth)) - 1) / 2;
                    }
                    switch (lengthType)
                    {
                        case LengthType.Width: return pixelPlusLength - Canvas.GetLeft(m_rect);
                        case LengthType.Height: return pixelPlusLength - Canvas.GetTop(m_rect);
                    }
                }

                return 0;
            }

            public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                var length = (double)value;
                var lengthType = (LengthType)parameter;
                double pixelPlusLength = 0.0;
                switch (lengthType)
                {
                    case LengthType.Width: pixelPlusLength = Canvas.GetLeft(m_rect) + length; break;
                    case LengthType.Height: pixelPlusLength = Canvas.GetTop(m_rect) + length; break;
                }
                var imageSource = m_image.Source as BitmapImage;
                if (imageSource != null)
                {
                    var pixelWidth = imageSource.PixelWidth;
                    return ((2 * pixelPlusLength) + 1) / (2 * pixelWidth);
                }

                return 0;
            }

            #endregion

            #endregion
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_AnimationFrameDefinition(AnimationFrameDefinition animationFrameDefinition) :
            base("Animation Frame Definition", false)
        {
            m_animationFrameDefinition = animationFrameDefinition;

            if (DataIsNull())
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
                m_textBox_texture.Text = string.Empty;
                m_doubleUpDown_duration.Value = 0.0;
                m_doubleUpDown_width.Value = 0.0;
                m_doubleUpDown_height.Value = 0.0;
                m_doubleUpDown_texCoordTop.Value = 0.0;
                m_doubleUpDown_texCoordLeft.Value = 0.0;
                m_doubleUpDown_texCoordRight.Value = 0.0;
                m_doubleUpDown_texCoordBottom.Value = 0.0;
            }
            else
            {
                m_textBlock_id.Text = m_animationFrameDefinition.Id.ToString();
                m_textBox_name.Text = m_animationFrameDefinition.Name;
                m_textBox_texture.Text = m_animationFrameDefinition.Texture;

                CreateCanvasControls();

                m_doubleUpDown_duration.Value = m_animationFrameDefinition.Duration;
                m_doubleUpDown_width.Value = m_animationFrameDefinition.Width;
                m_doubleUpDown_height.Value = m_animationFrameDefinition.Height;
                // haha, we actually need to set the left and the top before the right and the bottom;
                // the way that we've bound this data relies on the Canvas.Left and Canvas.Top properties being accurate
                m_doubleUpDown_texCoordTop.Value = m_animationFrameDefinition.TexCoordTop;
                m_doubleUpDown_texCoordLeft.Value = m_animationFrameDefinition.TexCoordLeft;
                m_doubleUpDown_texCoordRight.Value = m_animationFrameDefinition.TexCoordRight;
                m_doubleUpDown_texCoordBottom.Value = m_animationFrameDefinition.TexCoordBottom;
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
            // Duration
            m_doubleUpDown_duration = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_duration = new ValidatorPanel(m_doubleUpDown_duration, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_duration = new Label() { Content = "Duration: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_duration = new Grid();
            grid_duration.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_duration.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_duration.SetRowColumn(validator_duration, 1, 0);
            grid_duration.SetRowColumn(label_duration, 0, 0);
            grid_left.SetRowColumn(grid_duration, 0, 0);

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
            grid_left.SetRowColumn(grid_width, 1, 0);

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
            grid_left.SetRowColumn(grid_height, 2, 0);

            ////////
            // Get/Set Width/Height
            Button button_getLengths = new Button() { Content = "Get Lengths" };
            button_getLengths.Click += (x, y) =>
                {
                    if (m_canvasWithRectangle != null && m_canvasWithRectangle.SizableRectangle != null)
                    {
                        m_doubleUpDown_width.Value = m_canvasWithRectangle.SizableRectangle.Width;
                        m_doubleUpDown_height.Value = m_canvasWithRectangle.SizableRectangle.Height;
                    }
                };
            Button button_setLengths = new Button() { Content = "Set Lengths" };
            button_setLengths.Click += (x, y) =>
            {
                if (m_canvasWithRectangle != null && m_canvasWithRectangle.SizableRectangle != null && m_doubleUpDown_width.Value.HasValue && m_doubleUpDown_height.Value.HasValue)
                {
                    m_canvasWithRectangle.SizableRectangle.Width = m_doubleUpDown_width.Value.Value;
                    m_canvasWithRectangle.SizableRectangle.Height = m_doubleUpDown_height.Value.Value;
                }
            };
            Grid grid_getSetLengths = new Grid() { Margin = new Thickness(1.0, 2.5, 1.0, 0.0) };
            grid_getSetLengths.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(50.0, GridUnitType.Star) });
            grid_getSetLengths.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(50.0, GridUnitType.Star) });
            grid_getSetLengths.SetRowColumn(button_getLengths, 0, 0);
            grid_getSetLengths.SetRowColumn(button_setLengths, 0, 1);
            grid_left.SetRowColumn(grid_getSetLengths, 3, 0);

            ////////
            // TexCoordTop
            m_doubleUpDown_texCoordTop = new DoubleUpDown() { Increment = .005, VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_texCoordTop = new ValidatorPanel(m_doubleUpDown_texCoordTop, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_texCoordTop = new Label() { Content = "TexCoordTop: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_texCoordTop = new Grid();
            grid_texCoordTop.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordTop.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordTop.SetRowColumn(validator_texCoordTop, 1, 0);
            grid_texCoordTop.SetRowColumn(label_texCoordTop, 0, 0);
            grid_left.SetRowColumn(grid_texCoordTop, 4, 0);

            ////////
            // TexCoordRight
            m_doubleUpDown_texCoordRight = new DoubleUpDown() { Increment = .005, VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_texCoordRight = new ValidatorPanel(m_doubleUpDown_texCoordRight, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_texCoordRight = new Label() { Content = "TexCoordRight: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_texCoordRight = new Grid();
            grid_texCoordRight.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordRight.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordRight.SetRowColumn(validator_texCoordRight, 1, 0);
            grid_texCoordRight.SetRowColumn(label_texCoordRight, 0, 0);
            grid_left.SetRowColumn(grid_texCoordRight, 5, 0);

            ////////
            // TexCoordBottom
            m_doubleUpDown_texCoordBottom = new DoubleUpDown() { Increment = .005, VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_texCoordBottom = new ValidatorPanel(m_doubleUpDown_texCoordBottom, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_texCoordBottom = new Label() { Content = "TexCoordBottom: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_texCoordBottom = new Grid();
            grid_texCoordBottom.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordBottom.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordBottom.SetRowColumn(validator_texCoordBottom, 1, 0);
            grid_texCoordBottom.SetRowColumn(label_texCoordBottom, 0, 0);
            grid_left.SetRowColumn(grid_texCoordBottom, 6, 0);

            ////////
            // TexCoordLeft
            m_doubleUpDown_texCoordLeft = new DoubleUpDown() { Increment = .005, VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_texCoordLeft = new ValidatorPanel(m_doubleUpDown_texCoordLeft, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_texCoordLeft = new Label() { Content = "TexCoordLeft: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_texCoordLeft = new Grid();
            grid_texCoordLeft.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordLeft.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordLeft.SetRowColumn(validator_texCoordLeft, 1, 0);
            grid_texCoordLeft.SetRowColumn(label_texCoordLeft, 0, 0);
            grid_left.SetRowColumn(grid_texCoordLeft, 7, 0);

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
                validator_duration,
                validator_width,
                validator_height,
                validator_texCoordTop,
                validator_texCoordRight,
                validator_texCoordBottom,
                validator_texCoordLeft
            }};
        }

        protected override bool DataIsNull()
        {
            return m_animationFrameDefinition == null;
        }

        protected override int AddNewData()
        {
            m_animationFrameDefinition = DataManager.Generate<AnimationFrameDefinition>();
            m_animationFrameDefinition.Name = m_textBox_name.Text;
            m_animationFrameDefinition.Texture = m_textBox_texture.Text;
            m_animationFrameDefinition.Duration = m_doubleUpDown_duration.Value;
            m_animationFrameDefinition.Width = m_doubleUpDown_width.Value.Value;
            m_animationFrameDefinition.Height = m_doubleUpDown_height.Value.Value;
            m_animationFrameDefinition.TexCoordTop = m_doubleUpDown_texCoordTop.Value.Value;
            m_animationFrameDefinition.TexCoordRight = m_doubleUpDown_texCoordRight.Value.Value;
            m_animationFrameDefinition.TexCoordBottom = m_doubleUpDown_texCoordBottom.Value.Value;
            m_animationFrameDefinition.TexCoordLeft = m_doubleUpDown_texCoordLeft.Value.Value;

            DataManager.AnimationFrameDefinitions.Add(m_animationFrameDefinition);

            SaveTextureInformation(m_animationFrameDefinition.Texture);

            return m_animationFrameDefinition.Id;
        }

        protected override int UpdateExistingData()
        {
            m_animationFrameDefinition.Name = m_textBox_name.Text;
            m_animationFrameDefinition.Texture = m_textBox_texture.Text;
            m_animationFrameDefinition.Duration = m_doubleUpDown_duration.Value;
            m_animationFrameDefinition.Width = m_doubleUpDown_width.Value.Value;
            m_animationFrameDefinition.Height = m_doubleUpDown_height.Value.Value;
            m_animationFrameDefinition.TexCoordTop = m_doubleUpDown_texCoordTop.Value.Value;
            m_animationFrameDefinition.TexCoordRight = m_doubleUpDown_texCoordRight.Value.Value;
            m_animationFrameDefinition.TexCoordBottom = m_doubleUpDown_texCoordBottom.Value.Value;
            m_animationFrameDefinition.TexCoordLeft = m_doubleUpDown_texCoordLeft.Value.Value;

            SaveTextureInformation(m_animationFrameDefinition.Texture);

            return m_animationFrameDefinition.Id;
        }

        protected override void RevertNewData()
        {
            m_textBox_name.Text = string.Empty;
            m_textBox_texture.Text = string.Empty;
            m_doubleUpDown_duration.Value = 0.0;
            m_doubleUpDown_width.Value = 0.0;
            m_doubleUpDown_height.Value = 0.0;
            m_doubleUpDown_texCoordTop.Value = 0.0;
            m_doubleUpDown_texCoordRight.Value = 0.0;
            m_doubleUpDown_texCoordBottom.Value = 0.0;
            m_doubleUpDown_texCoordLeft.Value = 0.0;
        }

        protected override void RevertExistingData()
        {
            m_textBlock_id.Text = m_animationFrameDefinition.Id.ToString();
            m_textBox_name.Text = m_animationFrameDefinition.Name;
            m_textBox_texture.Text = m_animationFrameDefinition.Texture;
            m_doubleUpDown_duration.Value = m_animationFrameDefinition.Duration;
            m_doubleUpDown_width.Value = m_animationFrameDefinition.Width;
            m_doubleUpDown_height.Value = m_animationFrameDefinition.Height;
            m_doubleUpDown_texCoordTop.Value = m_animationFrameDefinition.TexCoordTop;
            m_doubleUpDown_texCoordRight.Value = m_animationFrameDefinition.TexCoordRight;
            m_doubleUpDown_texCoordBottom.Value = m_animationFrameDefinition.TexCoordBottom;
            m_doubleUpDown_texCoordLeft.Value = m_animationFrameDefinition.TexCoordLeft;
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

            Binding binding_rectangle_texCoordTop =
                new Binding("Value")
                {
                    Source = m_doubleUpDown_texCoordTop,
                    Mode = BindingMode.TwoWay,
                    UpdateSourceTrigger = System.Windows.Data.UpdateSourceTrigger.PropertyChanged,
                    Converter = new TextureCoordFromPixelConverter(m_image)
                };
            m_canvasWithRectangle.SizableRectangle.SetBinding(Canvas.TopProperty, binding_rectangle_texCoordTop);

            Binding binding_rectangle_texCoordRight =
                new Binding("Value")
                {
                    Source = m_doubleUpDown_texCoordRight,
                    Mode = BindingMode.TwoWay,
                    UpdateSourceTrigger = System.Windows.Data.UpdateSourceTrigger.PropertyChanged,
                    ConverterParameter = TextureCoordFromLengthConverter.LengthType.Width,
                    Converter = new TextureCoordFromLengthConverter(m_image, m_canvasWithRectangle.SizableRectangle)
                };
            m_canvasWithRectangle.SizableRectangle.SetBinding(Rectangle.WidthProperty, binding_rectangle_texCoordRight);

            Binding binding_rectangle_texCoordBottom =
                new Binding("Value")
                {
                    Source = m_doubleUpDown_texCoordBottom,
                    Mode = BindingMode.TwoWay,
                    UpdateSourceTrigger = System.Windows.Data.UpdateSourceTrigger.PropertyChanged,
                    ConverterParameter = TextureCoordFromLengthConverter.LengthType.Height,
                    Converter = new TextureCoordFromLengthConverter(m_image, m_canvasWithRectangle.SizableRectangle)
                };
            m_canvasWithRectangle.SizableRectangle.SetBinding(Rectangle.HeightProperty, binding_rectangle_texCoordBottom);

            Binding binding_rectangle_texCoordLeft =
                new Binding("Value")
                {
                    Source = m_doubleUpDown_texCoordLeft,
                    Mode = BindingMode.TwoWay,
                    UpdateSourceTrigger = System.Windows.Data.UpdateSourceTrigger.PropertyChanged,
                    ConverterParameter = m_image,
                    Converter = new TextureCoordFromPixelConverter(m_image)
                };
            m_canvasWithRectangle.SizableRectangle.SetBinding(Canvas.LeftProperty, binding_rectangle_texCoordLeft);

            m_canvasWithRectangle.SizableRectangle.Width = 
                m_canvasWithRectangle.SizableRectangle.Height = 
                    c_defaultWidthHeight;
        }

        private void SelectTextureFile()
        {
            Window_OpenFile window =
                new Window_OpenFile("Select Texture",
                    (m_animationFrameDefinition != null) ? m_animationFrameDefinition.Texture : null,
                    new[] { new Window_OpenFile.Filter("PNG Files (.png)", "*.png"), new Window_OpenFile.Filter("JPEG Files (.jpg)", "*.jpg") });
            window.ShowDialog();
            if (window.Accepted)
            {
                m_textBox_texture.Text = window.FileName;
                ParseTextureInformationFromFile(window.FileName);
                CreateCanvasControls();
            }
        }

        private void ParseTextureInformationFromFile(string behaviorFile)
        {
            if (File.Exists(behaviorFile))
            {
                //throw new NotImplementedException();
            }
        }

        #endregion

        #endregion
    }
}
