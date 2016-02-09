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

        private enum RectangleHitType
        {
            None,
            Body,
            Top,
            UpperRight,
            Right,
            LowerRight,
            Bottom,
            LowerLeft,
            Left,
            UpperLeft
        };

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

        private Zoombox m_zoomBox;
        private Canvas m_canvas;
        private Image m_image;
        private Rectangle m_rect;
        private RectangleHitType m_hitType = RectangleHitType.None;
        private bool m_dragInProgress = false;
        private Point m_lastPoint;
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

                return new BitmapImage(new Uri(imageFile));
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

        public UserControl_AnimationFrameDefinition(AnimationFrameDefinition animationFrameDefinition) :
            base("Animation Frame Definition", false)
        {
            m_animationFrameDefinition = animationFrameDefinition;

            if (DataIsNull())
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
                m_textBox_texture.Text = string.Empty;
                m_doubleUpDown_duration.Value = null;
                m_doubleUpDown_width.Value = null;
                m_doubleUpDown_height.Value = null;
                m_doubleUpDown_texCoordTop.Value = null;
                m_doubleUpDown_texCoordRight.Value = null;
                m_doubleUpDown_texCoordBottom.Value = null;
                m_doubleUpDown_texCoordLeft.Value = null;

                CreateCanvasControls();
            }
            else
            {
                CreateCanvasControls();

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
            grid_main.SetGridRowColumn(grid_sub, 3, 0);

            Grid grid_left = new Grid();
            grid_left.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_left.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_left.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_left.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_left.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_left.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_left.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_sub.SetGridRowColumn(grid_left, 0, 0);

            ////////
            // Id
            m_textBlock_id = new TextBlock() { VerticalAlignment = VerticalAlignment.Center };
            Label label_id = new Label() { Content = "Id: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_id = new Grid();
            grid_id.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_id.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_id.SetGridRowColumn(m_textBlock_id, 0, 1);
            grid_id.SetGridRowColumn(label_id, 0, 0);
            grid_main.SetGridRowColumn(grid_id, 0, 0);

            ////////
            // Name
            m_textBox_name = new TextBox() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_name = new ValidatorPanel(m_textBox_name, TextBox.TextProperty, new Validate_StringIsNotNullOrEmpty());
            Label label_name = new Label() { Content = "Name: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_name = new Grid();
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.SetGridRowColumn(validator_name, 1, 0);
            grid_name.SetGridRowColumn(label_name, 0, 0);
            grid_main.SetGridRowColumn(grid_name, 1, 0);

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
            grid_texture.SetGridRowColumn(validator_texture, 1, 0);
            grid_texture.SetGridRowColumn(label_texture, 0, 0);
            grid_main.SetGridRowColumn(grid_texture, 2, 0);

            ////////
            // Duration
            m_doubleUpDown_duration = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_duration = new ValidatorPanel(m_doubleUpDown_duration, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_duration = new Label() { Content = "Duration: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_duration = new Grid();
            grid_duration.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_duration.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_duration.SetGridRowColumn(validator_duration, 1, 0);
            grid_duration.SetGridRowColumn(label_duration, 0, 0);
            grid_left.SetGridRowColumn(grid_duration, 0, 0);

            ////////
            // Width
            m_doubleUpDown_width = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_width = new ValidatorPanel(m_doubleUpDown_width, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_width = new Label() { Content = "Width: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_width = new Grid();
            grid_width.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_width.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_width.SetGridRowColumn(validator_width, 1, 0);
            grid_width.SetGridRowColumn(label_width, 0, 0);
            grid_left.SetGridRowColumn(grid_width, 1, 0);

            ////////
            // Height
            m_doubleUpDown_height = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_height = new ValidatorPanel(m_doubleUpDown_height, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_height = new Label() { Content = "Height: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_height = new Grid();
            grid_height.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_height.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_height.SetGridRowColumn(validator_height, 1, 0);
            grid_height.SetGridRowColumn(label_height, 0, 0);
            grid_left.SetGridRowColumn(grid_height, 2, 0);

            ////////
            // TexCoordTop
            m_doubleUpDown_texCoordTop = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_texCoordTop = new ValidatorPanel(m_doubleUpDown_texCoordTop, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_texCoordTop = new Label() { Content = "TexCoordTop: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_texCoordTop = new Grid();
            grid_texCoordTop.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordTop.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordTop.SetGridRowColumn(validator_texCoordTop, 1, 0);
            grid_texCoordTop.SetGridRowColumn(label_texCoordTop, 0, 0);
            grid_left.SetGridRowColumn(grid_texCoordTop, 3, 0);

            ////////
            // TexCoordRight
            m_doubleUpDown_texCoordRight = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_texCoordRight = new ValidatorPanel(m_doubleUpDown_texCoordRight, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_texCoordRight = new Label() { Content = "TexCoordRight: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_texCoordRight = new Grid();
            grid_texCoordRight.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordRight.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordRight.SetGridRowColumn(validator_texCoordRight, 1, 0);
            grid_texCoordRight.SetGridRowColumn(label_texCoordRight, 0, 0);
            grid_left.SetGridRowColumn(grid_texCoordRight, 4, 0);

            ////////
            // TexCoordBottom
            m_doubleUpDown_texCoordBottom = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_texCoordBottom = new ValidatorPanel(m_doubleUpDown_texCoordBottom, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_texCoordBottom = new Label() { Content = "TexCoordBottom: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_texCoordBottom = new Grid();
            grid_texCoordBottom.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordBottom.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordBottom.SetGridRowColumn(validator_texCoordBottom, 1, 0);
            grid_texCoordBottom.SetGridRowColumn(label_texCoordBottom, 0, 0);
            grid_left.SetGridRowColumn(grid_texCoordBottom, 5, 0);

            ////////
            // TexCoordLeft
            m_doubleUpDown_texCoordLeft = new DoubleUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_texCoordLeft = new ValidatorPanel(m_doubleUpDown_texCoordLeft, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_texCoordLeft = new Label() { Content = "TexCoordLeft: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_texCoordLeft = new Grid();
            grid_texCoordLeft.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordLeft.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_texCoordLeft.SetGridRowColumn(validator_texCoordLeft, 1, 0);
            grid_texCoordLeft.SetGridRowColumn(label_texCoordLeft, 0, 0);
            grid_left.SetGridRowColumn(grid_texCoordLeft, 6, 0);

            ////////
            // Canvas
            m_canvas = new Canvas() { Background = Brushes.Gray, Width = 500, Height = 500 };
            m_canvas.MouseDown += Canvas_MouseDown;
            m_canvas.MouseMove += Canvas_MouseMove;
            m_canvas.MouseUp += Canvas_MouseUp;
            m_zoomBox = new Zoombox() { Content = m_canvas, Background = Brushes.Black };
            grid_sub.SetGridRowColumn(m_zoomBox, 0, 1);

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

        protected override void AddNewData()
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
        }

        protected override void UpdateExistingData()
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
        }

        protected override void RevertNewData()
        {
            m_textBox_name.Text = string.Empty;
            m_textBox_texture.Text = string.Empty;
            m_doubleUpDown_duration.Value = null;
            m_doubleUpDown_width.Value = null;
            m_doubleUpDown_height.Value = null;
            m_doubleUpDown_texCoordTop.Value = null;
            m_doubleUpDown_texCoordRight.Value = null;
            m_doubleUpDown_texCoordBottom.Value = null;
            m_doubleUpDown_texCoordLeft.Value = null;
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

        private void CreateCanvasControls()
        {
            m_image = new Image();
            Binding binding_imageSource =
                new Binding("Source")
                {
                    Source = m_textBox_texture.Text,
                    Mode = BindingMode.OneWay,
                    Converter = new BitmapSourceConverter()
                };
            m_canvas.Children.Add(m_image);

            m_rect = 
                new Rectangle()
                {
                    Fill = new SolidColorBrush(Brushes.WhiteSmoke.Color) { Opacity = 0.25 },
                    Stroke = Brushes.Black,
                    StrokeThickness = 1.0,
                    Width = c_defaultWidthHeight,
                    Height = c_defaultWidthHeight
                };
            m_canvas.Children.Add(m_rect);
            Canvas.SetLeft(m_rect, 0.0);
            Canvas.SetTop(m_rect, 0.0);
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
            }
        }

        private void ParseTextureInformationFromFile(string behaviorFile)
        {
            if (File.Exists(behaviorFile))
            {
                throw new NotImplementedException();
            }
        }

        void Canvas_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            var canvas = sender as Canvas;
            if (canvas != null && canvas == m_canvas)
            {
                m_hitType = Canvas_GetHitType(m_rect, Mouse.GetPosition(m_canvas));
                var desiredCursor = Canvas_GetMouseCursor(m_hitType);
                if (Cursor != desiredCursor)
                    Cursor = desiredCursor;

                if (m_hitType == RectangleHitType.None) 
                    return;

                m_lastPoint = Mouse.GetPosition(m_canvas);
                m_dragInProgress = true;
            }
        }

        private void Canvas_MouseMove(object sender, MouseEventArgs e)
        {
            var canvas = sender as Canvas;
            if (canvas != null && canvas == m_canvas && m_dragInProgress)
            {
                // See how much the mouse has moved
                Point point = Mouse.GetPosition(m_canvas);
                double offset_x = point.X - m_lastPoint.X;
                double offset_y = point.Y - m_lastPoint.Y;

                // Get the rectangle's current position
                double new_x = Canvas.GetLeft(m_rect);
                double new_y = Canvas.GetTop(m_rect);
                double new_width = m_rect.Width;
                double new_height = m_rect.Height;

                // Update the rectangle
                switch (m_hitType)
                {
                    case RectangleHitType.Body:
                        new_x += offset_x;
                        new_y += offset_y;
                        break;
                    case RectangleHitType.Top:
                        new_y += offset_y;
                        new_height -= offset_y;
                        break;
                    case RectangleHitType.UpperRight:
                        new_y += offset_y;
                        new_width += offset_x;
                        new_height -= offset_y;
                        break;
                    case RectangleHitType.Right:
                        new_width += offset_x;
                        break;
                    case RectangleHitType.LowerRight:
                        new_width += offset_x;
                        new_height += offset_y;
                        break;
                    case RectangleHitType.Bottom:
                        new_height += offset_y;
                        break;
                    case RectangleHitType.LowerLeft:
                        new_x += offset_x;
                        new_width -= offset_x;
                        new_height += offset_y;
                        break;
                    case RectangleHitType.Left:
                        new_x += offset_x;
                        new_width -= offset_x;
                        break;
                    case RectangleHitType.UpperLeft:
                        new_x += offset_x;
                        new_y += offset_y;
                        new_width -= offset_x;
                        new_height -= offset_y;
                        break;
                }

                // Don't use negative width or height
                if ((new_width > 0) && (new_height > 0))
                {
                    // Update the rectangle
                    Canvas.SetLeft(m_rect, new_x);
                    Canvas.SetTop(m_rect, new_y);
                    m_rect.Width = new_width;
                    m_rect.Height = new_height;

                    // Save the mouse's new location
                    m_lastPoint = point;
                }
            }
            else
            {
                m_hitType = Canvas_GetHitType(m_rect, Mouse.GetPosition(m_canvas));
                var desiredCursor = Canvas_GetMouseCursor(m_hitType);
                if (Cursor != desiredCursor)
                    Cursor = desiredCursor;
            }
        }

        private void Canvas_MouseUp(object sender, MouseButtonEventArgs e)
        {
            var canvas = sender as Canvas;
            if (canvas != null && canvas == m_canvas)
            {
                m_dragInProgress = false;
            }
        }

        private RectangleHitType Canvas_GetHitType(Rectangle rect, Point point)
        {
            double left = Canvas.GetLeft(rect);
            double top = Canvas.GetTop(rect);
            double right = left + rect.Width;
            double bottom = top + rect.Height;

            if (point.X < left || point.X > right || point.Y < top || point.Y > bottom) 
                return RectangleHitType.None;

            const double GAP = 10;
            if (point.X - left < GAP)
            {
                // Left edge
                if (point.Y - top < GAP) 
                    return RectangleHitType.UpperLeft;
                else if (bottom - point.Y < GAP) 
                    return RectangleHitType.LowerLeft;
                return RectangleHitType.Left;
            }
            else if (right - point.X < GAP)
            {
                // Right edge
                if (point.Y - top < GAP) 
                    return RectangleHitType.UpperRight;
                else if (bottom - point.Y < GAP) 
                    return RectangleHitType.LowerRight;
                return RectangleHitType.Right;
            }
            else if (point.Y - top < GAP) 
                return RectangleHitType.Top;
            else if (bottom - point.Y < GAP) 
                return RectangleHitType.Bottom;

            return RectangleHitType.Body;
        }

        private Cursor Canvas_GetMouseCursor(RectangleHitType hitType)
        {
            Cursor desiredCursor = Cursors.Arrow;
            switch (hitType)
            {
                case RectangleHitType.None:
                    desiredCursor = Cursors.Arrow;
                    break;
                case RectangleHitType.Body:
                    desiredCursor = Cursors.ScrollAll;
                    break;
                case RectangleHitType.Top:
                case RectangleHitType.Bottom:
                    desiredCursor = Cursors.SizeNS;
                    break;
                case RectangleHitType.LowerLeft:
                case RectangleHitType.UpperRight:
                    desiredCursor = Cursors.SizeNESW;
                    break;
                case RectangleHitType.Left:
                case RectangleHitType.Right:
                    desiredCursor = Cursors.SizeWE;
                    break;
                case RectangleHitType.UpperLeft:
                case RectangleHitType.LowerRight:
                    desiredCursor = Cursors.SizeNWSE;
                    break;
            }

            return desiredCursor;
        }

        #endregion

        #endregion
    }
}
