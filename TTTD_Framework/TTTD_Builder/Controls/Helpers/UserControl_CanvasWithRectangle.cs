using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;


namespace TTTD_Builder.Controls.Helpers
{
    public class UserControl_CanvasWithRectangle : UserControl
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

        private Canvas m_canvas;
        private Rectangle m_rect = new Rectangle();
        private RectangleHitType m_hitType = RectangleHitType.None;
        private bool m_dragInProgress = false;
        private Point m_lastPoint;

        #endregion


        #region MEMBER PROPERTIES

        public Canvas BackgroundCanvas
        {
            get { return m_canvas; }
        }

        public Rectangle SizableRectangle
        {
            get { return m_rect; }
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_CanvasWithRectangle(IEnumerable<UIElement> firstChildren)
        {
            m_canvas = new Canvas() { Background = Brushes.Gray };
            m_canvas.MouseDown += Canvas_MouseDown;
            m_canvas.MouseMove += Canvas_MouseMove;
            m_canvas.MouseUp += Canvas_MouseUp;

            foreach (var child in firstChildren)
                m_canvas.Children.Add(child);

            m_rect =
                new Rectangle()
                {
                    Fill = new SolidColorBrush(Brushes.WhiteSmoke.Color) { Opacity = 0.25 },
                    Stroke = Brushes.Black,
                    StrokeThickness = 1.0
                };
            m_canvas.Children.Add(m_rect);
            ResetRectangle();

            Content = m_canvas;
        }

        public void ResetRectangle()
        {
            Canvas.SetLeft(m_rect, 0.0);
            Canvas.SetTop(m_rect, 0.0);
        }

        #endregion


        #region Private Functionality

        void Canvas_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            var canvas = sender as Canvas;
            if (canvas != null && canvas == m_canvas && m_rect != null)
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
            if (canvas != null && canvas == m_canvas && m_dragInProgress && m_rect != null)
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
            if (canvas != null && canvas == m_canvas && m_rect != null)
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

            const double GAP = 3;
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
