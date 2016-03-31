using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;
using System.Windows.Media.Imaging;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Controls.Validation;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;
using TTTD_Builder.Model.Extensions;


namespace TTTD_Builder.EditData
{
    public class UserControl_PhysicsInstanceDefinition : UserControl_EditData
    {
        #region MEMBER FIELDS

        private PhysicsInstanceDefinition m_physicsInstanceDefinition;
        private PhysicsInstanceDefinition_Ex m_physicsInstanceDefinitionEx;

        private TextBlock m_textBlock_id;
        private TextBox m_textBox_name;
        private ComboBox m_comboBox_entityInstanceDefinition;
        private ComboBox m_comboBox_collisionType;
        private ComboBox m_comboBox_physType;
        private Grid m_grid_subSub;
        private Grid m_grid_boundingData;

        private BitmapSource m_bitmapSource;
        private Image m_image;
        private UserControl_CanvasWithRectangle m_canvasWithRectangle;
        private const double c_defaultWidthHeight = 32.0;

        #endregion


        #region MEMBER PROPERTIES

        private PhysicsInstanceDefinition_Ex.PhysicsInstanceDefinitionType PhysicsInstanceDefinitionType
        {
            get;
            set;
        }

        #endregion


        #region MEMBER CLASSES

        public class OriginConverter : IMultiValueConverter
        {
            #region MEMBER METHODS

            #region Public Functionality

            public object Convert(object[] values, Type targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                var edge = (double)values.First();
                var halfValue = (double)values.Last();

                return System.Convert.ChangeType(edge + halfValue, targetType);
            }


            public object[] ConvertBack(object value, Type[] targetTypes, object parameter, System.Globalization.CultureInfo culture)
            {
                throw new NotImplementedException();
            }

            #endregion

            #endregion
        }

        public class HalfValueConverter : IValueConverter
        {
            #region MEMBER METHODS

            #region Public Functionality

            public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
            {
                var fullValue = (double)value;

                return System.Convert.ChangeType(fullValue / 2.0, targetType);
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

        public UserControl_PhysicsInstanceDefinition() :
            base("Physics Instance Type Definition", false)
        {
            PhysicsInstanceDefinitionType = PhysicsInstanceDefinition_Ex.PhysicsInstanceDefinitionType.Undetermined;

            m_textBlock_id.Text = "N/A";
            m_textBox_name.Text = string.Empty;
        }

        public UserControl_PhysicsInstanceDefinition(PhysicsInstanceDefinition_WithAABB physicsInstanceDefinition_ex) :
            base("Physics Instance Type Definition", false)
        {
            PhysicsInstanceDefinitionType = physicsInstanceDefinition_ex.TypeOfInstance;

            m_physicsInstanceDefinition = physicsInstanceDefinition_ex.PhysicsInstanceDefinition;
            
            if (DataIsNull())
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
            }
            else
            {
                m_textBlock_id.Text = m_physicsInstanceDefinition.Id.ToString();
                m_textBox_name.Text = m_physicsInstanceDefinition.Name;
                m_comboBox_entityInstanceDefinition.SelectedItem = m_physicsInstanceDefinition.EntityInstanceDefinition;
                m_comboBox_collisionType.SelectedItem = m_physicsInstanceDefinition.CollisionType;
                m_comboBox_physType.SelectedItem = m_physicsInstanceDefinition.PhysType;

                var aabb = physicsInstanceDefinition_ex as PhysicsInstanceDefinition_WithAABB;
                SetAABBControls(aabb);
            }
        }

        public UserControl_PhysicsInstanceDefinition(PhysicsInstanceDefinition_WithCircle physicsInstanceDefinition_ex) :
            base("Physics Instance Type Definition", false)
        {
            PhysicsInstanceDefinitionType = physicsInstanceDefinition_ex.TypeOfInstance;

            m_physicsInstanceDefinition = physicsInstanceDefinition_ex.PhysicsInstanceDefinition;

            if (DataIsNull())
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
            }
            else
            {
                m_textBlock_id.Text = m_physicsInstanceDefinition.Id.ToString();
                m_textBox_name.Text = m_physicsInstanceDefinition.Name;
                m_comboBox_entityInstanceDefinition.SelectedItem = m_physicsInstanceDefinition.EntityInstanceDefinition;
                m_comboBox_collisionType.SelectedItem = m_physicsInstanceDefinition.CollisionType;
                m_comboBox_physType.SelectedItem = m_physicsInstanceDefinition.PhysType;

                var circle = physicsInstanceDefinition_ex as PhysicsInstanceDefinition_WithCircle;
                SetCircleControls(circle);
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
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });

            ////////
            // BoundingData
            Grid grid_sub = new Grid();
            grid_sub.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(30.0, GridUnitType.Star) });
            grid_sub.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(70.0, GridUnitType.Star) });
            grid_main.SetRowColumn(grid_sub, 5, 0);

            m_grid_subSub = new Grid();
            grid_sub.SetRowColumn(m_grid_subSub, 0, 0);

            m_image = new Image() { Stretch = System.Windows.Media.Stretch.None };
            m_canvasWithRectangle = new UserControl_CanvasWithRectangle(new[] { m_image }) { Width = 500, Height = 500 };
            grid_sub.SetRowColumn(m_canvasWithRectangle, 0, 1);

            m_canvasWithRectangle.SizableRectangle.Width =
                m_canvasWithRectangle.SizableRectangle.Height =
                    c_defaultWidthHeight;

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
            m_comboBox_entityInstanceDefinition.SelectionChanged += ComboBox_EntityInstanceDefinition_SelectionChanged;
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
            // CollisionType
            CollectionViewSource collectionViewSource_collisionType =
                new CollectionViewSource()
                {
                    Source = DataManager.CollisionTypes
                };
            m_comboBox_collisionType =
                new ComboBox()
                {
                    DisplayMemberPath = "Name",
                    IsTextSearchEnabled = true
                };
            m_comboBox_collisionType.SetBinding(ItemsControl.ItemsSourceProperty, new Binding() { Source = collectionViewSource_collisionType });
            ValidatorPanel validator_collisionType = new ValidatorPanel(m_comboBox_collisionType, ComboBox.SelectedItemProperty, new Validate_NotNull());

            Label label_collisionType = new Label() { Content = "Collision Type: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_collisionType = new Grid();
            grid_collisionType.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_collisionType.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_collisionType.SetRowColumn(validator_collisionType, 1, 0);
            grid_collisionType.SetRowColumn(label_collisionType, 0, 0);
            grid_main.SetRowColumn(grid_collisionType, 3, 0);

            ////////
            // PhysType
            CollectionViewSource collectionViewSource_physType =
                new CollectionViewSource()
                {
                    Source = DataManager.PhysTypes
                };
            m_comboBox_physType =
                new ComboBox()
                {
                    DisplayMemberPath = "Name",
                    IsTextSearchEnabled = true
                };
            m_comboBox_physType.SetBinding(ItemsControl.ItemsSourceProperty, new Binding() { Source = collectionViewSource_physType });
            m_comboBox_physType.SelectionChanged += ComboBox_PhysType_SelectionChanged;
            ValidatorPanel validator_physType = new ValidatorPanel(m_comboBox_physType, ComboBox.SelectedItemProperty, new Validate_NotNull());

            Label label_physType = new Label() { Content = "Phys Type: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_physType = new Grid();
            grid_physType.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_physType.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_physType.SetRowColumn(validator_physType, 1, 0);
            grid_physType.SetRowColumn(label_physType, 0, 0);
            grid_main.SetRowColumn(grid_physType, 4, 0);

            ////////
            // FIN
            ThisContent = new ActivatableContent() { Content = grid_main, FirstFocus = m_textBox_name, Validators = new ValidatorBase[] {
                validator_name,
                validator_entityInstanceDefinition,
                validator_collisionType,
                validator_physType
            }};
        }

        protected override bool DataIsNull()
        {
            return m_physicsInstanceDefinition == null;
        }

        protected override int AddNewData()
        {
            m_physicsInstanceDefinition = DataManager.Generate<PhysicsInstanceDefinition>();
            m_physicsInstanceDefinition.Name = m_textBox_name.Text;
            m_physicsInstanceDefinition.EntityInstanceDefinition = m_comboBox_entityInstanceDefinition.SelectedItem as EntityInstanceDefinition;
            m_physicsInstanceDefinition.CollisionType = m_comboBox_collisionType.SelectedItem as CollisionType;
            m_physicsInstanceDefinition.PhysType = m_comboBox_physType.SelectedItem as PhysType;

            m_physicsInstanceDefinitionEx.PhysicsInstanceDefinition = m_physicsInstanceDefinition;

            DataManager.PhysicsInstanceDefinitions.Add(m_physicsInstanceDefinition);

            return m_physicsInstanceDefinition.Id;
        }

        protected override int UpdateExistingData()
        {
            m_physicsInstanceDefinition.Name = m_textBox_name.Text;
            m_physicsInstanceDefinition.EntityInstanceDefinition = m_comboBox_entityInstanceDefinition.SelectedItem as EntityInstanceDefinition;
            m_physicsInstanceDefinition.CollisionType = m_comboBox_collisionType.SelectedItem as CollisionType;
            m_physicsInstanceDefinition.PhysType = m_comboBox_physType.SelectedItem as PhysType;

            m_physicsInstanceDefinitionEx.PhysicsInstanceDefinition = m_physicsInstanceDefinition;

            return m_physicsInstanceDefinition.Id;
        }

        protected override void RevertNewData()
        {
            m_textBox_name.Text = string.Empty;
            m_comboBox_entityInstanceDefinition.SelectedItem = null;
            m_comboBox_collisionType.SelectedItem = null;
            m_comboBox_physType.SelectedItem = null;
        }

        protected override void RevertExistingData()
        {
            m_textBox_name.Text = m_physicsInstanceDefinition.Name;
            m_comboBox_entityInstanceDefinition.SelectedItem = m_physicsInstanceDefinition.EntityInstanceDefinition;
            m_comboBox_collisionType.SelectedItem = m_physicsInstanceDefinition.CollisionType;
            m_comboBox_physType.SelectedItem = m_physicsInstanceDefinition.PhysType;

            SetPhysicsInstanceDefinitionType(m_physicsInstanceDefinition.PhysType.Name);
            switch (PhysicsInstanceDefinitionType)
            {
                case PhysicsInstanceDefinition_Ex.PhysicsInstanceDefinitionType.AABB:
                    SetAABBControls(new PhysicsInstanceDefinition_WithAABB(m_physicsInstanceDefinition));
                    break;
                case PhysicsInstanceDefinition_Ex.PhysicsInstanceDefinitionType.Circle:
                    SetCircleControls(new PhysicsInstanceDefinition_WithCircle(m_physicsInstanceDefinition));
                    break;
            }
        }

        private void DisplayAnimationFrame(AnimationFrameDefinition animationFrameDefinition)
        {
            if (!string.IsNullOrWhiteSpace(animationFrameDefinition.Texture))
            {
                m_bitmapSource = Extensions
                    .BitmapSourceFromTextureCoords
                    (
                        animationFrameDefinition.Texture,
                        animationFrameDefinition.TexCoordTop,
                        animationFrameDefinition.TexCoordRight,
                        animationFrameDefinition.TexCoordBottom,
                        animationFrameDefinition.TexCoordLeft,
                        animationFrameDefinition.Width,
                        animationFrameDefinition.Height
                    );
            }
            else
                m_bitmapSource = null;

            m_image.Source = m_bitmapSource;
        }

        private void ComboBox_EntityInstanceDefinition_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var comboBox = sender as ComboBox;
            if(comboBox != null && comboBox == m_comboBox_entityInstanceDefinition)
            {
                var ent = m_comboBox_entityInstanceDefinition.SelectedItem as EntityInstanceDefinition;
                if (ent != null)
                {
                    var aniFrame = ent.GetFirstAnimationFrameDefinition();
                    if (aniFrame != null)
                    {
                        DisplayAnimationFrame(aniFrame);
                    }
                }
            }
        }

        private void ComboBox_PhysType_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var comboBox = sender as ComboBox;
            if (comboBox != null && comboBox == m_comboBox_physType)
            {
                var physType = m_comboBox_physType.SelectedItem as PhysType;
                if (physType != null)
                {
                    SetPhysicsInstanceDefinitionType(physType.Name);
                }
            }
        }

        private void SetPhysicsInstanceDefinitionType(string physTypeName)
        {
            switch (physTypeName)
            {
                case "AABB":
                    m_physicsInstanceDefinitionEx = new PhysicsInstanceDefinition_WithAABB(null);
                    PhysicsInstanceDefinitionType = PhysicsInstanceDefinition_Ex.PhysicsInstanceDefinitionType.AABB;
                    CreateAABBControls();
                    break;
                case "Circle":
                    m_physicsInstanceDefinitionEx = new PhysicsInstanceDefinition_WithCircle(null);
                    PhysicsInstanceDefinitionType = PhysicsInstanceDefinition_Ex.PhysicsInstanceDefinitionType.Circle;
                    CreateCircleControls();
                    break;
            }
        }

        private void CreateAABBControls()
        {
            m_grid_subSub.Children.Clear();
            m_grid_subSub.RowDefinitions.Clear();
            m_grid_subSub.ColumnDefinitions.Clear();
            m_grid_subSub.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_subSub.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_subSub.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_subSub.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_subSub.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(30.0, GridUnitType.Star) });
            m_grid_subSub.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(70.0, GridUnitType.Star) });

            Binding binding_rectangle_canvasLeft =
                new Binding()
                {
                    Source = m_canvasWithRectangle.SizableRectangle,
                    Path = new PropertyPath(Canvas.LeftProperty)
                };
            Binding binding_rectangle_halfWidth =
                new Binding("Width")
                {
                    Source = m_canvasWithRectangle.SizableRectangle,
                    Converter = new HalfValueConverter()
                };
            Binding binding_rectangle_canvasTop =
                new Binding()
                {
                    Source = m_canvasWithRectangle.SizableRectangle,
                    Path = new PropertyPath(Canvas.TopProperty)
                };
            Binding binding_rectangle_halfHeight =
                new Binding("Height")
                {
                    Source = m_canvasWithRectangle.SizableRectangle,
                    Converter = new HalfValueConverter()
                };

            ////////
            // OriginX
            TextBox textBox_originX = new TextBox() { VerticalAlignment = VerticalAlignment.Center, IsEnabled = false };
            textBox_originX.TextChanged += (x, y) =>
            {
                var p = (m_physicsInstanceDefinitionEx as PhysicsInstanceDefinition_WithAABB);
                if(p != null)
                    p.OriginX = double.Parse(textBox_originX.Text);
            };
            Label label_originX = new Label() { Content = "Origin X: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            m_grid_subSub.SetRowColumn(textBox_originX, 0, 1);
            m_grid_subSub.SetRowColumn(label_originX, 0, 0);

            MultiBinding textBox_originX_binding = new MultiBinding() { Converter = new OriginConverter() };
            textBox_originX_binding.Bindings.Add(binding_rectangle_canvasLeft);
            textBox_originX_binding.Bindings.Add(binding_rectangle_halfWidth);
            textBox_originX.SetBinding(TextBox.TextProperty, textBox_originX_binding);

            ////////
            // OriginY
            TextBox textBox_originY = new TextBox() { VerticalAlignment = VerticalAlignment.Center, IsEnabled = false };
            textBox_originY.TextChanged += (x, y) =>
            {
                var p = (m_physicsInstanceDefinitionEx as PhysicsInstanceDefinition_WithAABB);
                if(p != null)
                    p.OriginY = double.Parse(textBox_originY.Text);
            };
            Label label_originY = new Label() { Content = "Origin Y: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            m_grid_subSub.SetRowColumn(textBox_originY, 1, 1);
            m_grid_subSub.SetRowColumn(label_originY, 1, 0);

            MultiBinding textBox_originY_binding = new MultiBinding() { Converter = new OriginConverter() };
            textBox_originY_binding.Bindings.Add(binding_rectangle_canvasTop);
            textBox_originY_binding.Bindings.Add(binding_rectangle_halfHeight );
            textBox_originY.SetBinding(TextBox.TextProperty, textBox_originY_binding);

            ////////
            // HalfValueX
            TextBox textBox_halfValueX = new TextBox() { VerticalAlignment = VerticalAlignment.Center, IsEnabled = false };
            textBox_halfValueX.TextChanged += (x, y) =>
            {
                var p = (m_physicsInstanceDefinitionEx as PhysicsInstanceDefinition_WithAABB);
                if (p != null)
                    p.HalfValueX = double.Parse(textBox_halfValueX.Text);
            };
            Label label_halfValueX = new Label() { Content = "HalfValue X: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            m_grid_subSub.SetRowColumn(textBox_halfValueX, 2, 1);
            m_grid_subSub.SetRowColumn(label_halfValueX, 2, 0);

            textBox_halfValueX.SetBinding(TextBox.TextProperty, binding_rectangle_halfWidth);

            ////////
            // HalfValueY
            TextBox textBox_halfValueY = new TextBox() { VerticalAlignment = VerticalAlignment.Center, IsEnabled = false };
            textBox_halfValueY.TextChanged += (x, y) =>
            {
                var p = (m_physicsInstanceDefinitionEx as PhysicsInstanceDefinition_WithAABB);
                if (p != null)
                    p.HalfValueY = double.Parse(textBox_halfValueX.Text);
            };
            Label label_halfValueY = new Label() { Content = "HalfValue Y: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            m_grid_subSub.SetRowColumn(textBox_halfValueY, 3, 1);
            m_grid_subSub.SetRowColumn(label_halfValueY, 3, 0);

            textBox_halfValueY.SetBinding(TextBox.TextProperty, binding_rectangle_halfHeight);
        }

        private void SetAABBControls(PhysicsInstanceDefinition_WithAABB aabb)
        {
            Canvas.SetLeft(m_canvasWithRectangle.SizableRectangle, aabb.OriginX - aabb.HalfValueX);
            Canvas.SetTop(m_canvasWithRectangle.SizableRectangle, aabb.OriginY - aabb.HalfValueY);
            m_canvasWithRectangle.SizableRectangle.Width = aabb.HalfValueX * 2.0;
            m_canvasWithRectangle.SizableRectangle.Height = aabb.HalfValueY * 2.0;
        }

        private void CreateCircleControls()
        {
            m_grid_subSub.Children.Clear();
            m_grid_subSub.RowDefinitions.Clear();
            m_grid_subSub.ColumnDefinitions.Clear();
            m_grid_subSub.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_subSub.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_subSub.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_subSub.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(30.0, GridUnitType.Star) });
            m_grid_subSub.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(70.0, GridUnitType.Star) });

            Binding binding_rectangle_canvasLeft =
                new Binding()
                {
                    Source = m_canvasWithRectangle.SizableRectangle,
                    Path = new PropertyPath(Canvas.LeftProperty)
                };
            Binding binding_rectangle_halfWidth =
                new Binding("Width")
                {
                    Source = m_canvasWithRectangle.SizableRectangle,
                    Converter = new HalfValueConverter()
                };
            Binding binding_rectangle_canvasTop =
                new Binding()
                {
                    Source = m_canvasWithRectangle.SizableRectangle,
                    Path = new PropertyPath(Canvas.TopProperty)
                };
            Binding binding_rectangle_halfHeight =
                new Binding("Height")
                {
                    Source = m_canvasWithRectangle.SizableRectangle,
                    Converter = new HalfValueConverter()
                };

            ////////
            // OriginX
            TextBox textBox_originX = new TextBox() { VerticalAlignment = VerticalAlignment.Center, IsEnabled = false };
            textBox_originX.TextChanged += (x, y) =>
            {
                var p = (m_physicsInstanceDefinitionEx as PhysicsInstanceDefinition_WithCircle);
                if (p != null)
                    p.OriginX = double.Parse(textBox_originX.Text);
            };
            Label label_originX = new Label() { Content = "Origin X: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            m_grid_subSub.SetRowColumn(textBox_originX, 0, 1);
            m_grid_subSub.SetRowColumn(label_originX, 0, 0);

            MultiBinding textBox_originX_binding = new MultiBinding() { Converter = new OriginConverter() };
            textBox_originX_binding.Bindings.Add(binding_rectangle_canvasLeft);
            textBox_originX_binding.Bindings.Add(binding_rectangle_halfWidth);
            textBox_originX.SetBinding(TextBox.TextProperty, textBox_originX_binding);

            ////////
            // OriginY
            TextBox textBox_originY = new TextBox() { VerticalAlignment = VerticalAlignment.Center, IsEnabled = false };
            textBox_originY.TextChanged += (x, y) =>
            {
                var p = (m_physicsInstanceDefinitionEx as PhysicsInstanceDefinition_WithCircle);
                if (p != null)
                    p.OriginY = double.Parse(textBox_originY.Text);
            };
            Label label_originY = new Label() { Content = "Origin Y: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            m_grid_subSub.SetRowColumn(textBox_originY, 1, 1);
            m_grid_subSub.SetRowColumn(label_originY, 1, 0);

            MultiBinding textBox_originY_binding = new MultiBinding() { Converter = new OriginConverter() };
            textBox_originY_binding.Bindings.Add(binding_rectangle_canvasTop);
            textBox_originY_binding.Bindings.Add(binding_rectangle_halfHeight);
            textBox_originY.SetBinding(TextBox.TextProperty, textBox_originY_binding);

            ////////
            // Radius
            TextBox textBox_radius = new TextBox() { VerticalAlignment = VerticalAlignment.Center, IsEnabled = false };
            textBox_radius.TextChanged += (x, y) =>
            {
                var p = (m_physicsInstanceDefinitionEx as PhysicsInstanceDefinition_WithCircle);
                if (p != null)
                    p.Radius = double.Parse(textBox_radius.Text);
            };
            Label label_radius = new Label() { Content = "Radius: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            m_grid_subSub.SetRowColumn(textBox_radius, 2, 1);
            m_grid_subSub.SetRowColumn(label_radius, 2, 0);

            textBox_radius.SetBinding(TextBox.TextProperty, binding_rectangle_halfWidth);
        }

        private void SetCircleControls(PhysicsInstanceDefinition_WithCircle circle)
        {
            Canvas.SetLeft(m_canvasWithRectangle.SizableRectangle, circle.OriginX - circle.Radius);
            Canvas.SetTop(m_canvasWithRectangle.SizableRectangle, circle.OriginY - circle.Radius);
            m_canvasWithRectangle.SizableRectangle.Width = circle.Radius * 2.0;
            m_canvasWithRectangle.SizableRectangle.Height = circle.Radius * 2.0;
        }

        #endregion

        #endregion
    }
}
