using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

using AutoMapper;

using TTTD_Builder.Model.Interfaces;

using ModelData = TTTD_Builder.Model.Data;
using LibData = TTTD_Builder.Lib.Data;


namespace TTTD_Builder.Managers
{
    public static class DataManager
    {
        #region MEMBER FIELDS

        private static ObservableCollection<ModelData.EntityInstanceDefinition> s_entityInstanceDefinitions = new ObservableCollection<ModelData.EntityInstanceDefinition>();

        private static ObservableCollection<ModelData.AudioType> s_audioTypes = new ObservableCollection<ModelData.AudioType>();
        private static ObservableCollection<ModelData.Audio> s_audio = new ObservableCollection<ModelData.Audio>();

        private static ObservableCollection<ModelData.BehaviorInstanceDefinition> s_behaviorInstanceDefinitions = new ObservableCollection<ModelData.BehaviorInstanceDefinition>();

        private static ObservableCollection<ModelData.GraphicsInstanceDefinition> s_graphicsInstanceDefinition = new ObservableCollection<ModelData.GraphicsInstanceDefinition>();
        private static ObservableCollection<ModelData.AnimationStateDefinition> s_animationStateDefinitions = new ObservableCollection<ModelData.AnimationStateDefinition>();
        private static ObservableCollection<ModelData.AnimationFrameDefinition> s_animationFrameDefinitions = new ObservableCollection<ModelData.AnimationFrameDefinition>();
        private static ObservableCollection<ModelData.FontTextureDefinition> s_fontTextureDefinition = new ObservableCollection<ModelData.FontTextureDefinition>();
        private static ObservableCollection<ModelData.Shader> s_shaders = new ObservableCollection<ModelData.Shader>();
        private static ObservableCollection<ModelData.TextureInformation> s_textureInformation = new ObservableCollection<ModelData.TextureInformation>();
        
        private static ObservableCollection<ModelData.CollisionType> s_collisionTypes = new ObservableCollection<ModelData.CollisionType>();
        private static ObservableCollection<ModelData.PhysType> s_physTypes = new ObservableCollection<ModelData.PhysType>();
        private static ObservableCollection<ModelData.PhysicsInstanceDefinition> s_physicsInstanceDefinitions = new ObservableCollection<ModelData.PhysicsInstanceDefinition>();

        private static ObservableCollection<ModelData.Level> s_levels = new ObservableCollection<ModelData.Level>();
        private static ObservableCollection<ModelData.LevelLayout> s_levelLayouts = new ObservableCollection<ModelData.LevelLayout>();


        private static Dictionary<Type, int> s_idGenerator = new Dictionary<Type, int>
        {
            { typeof(ModelData.EntityInstanceDefinition), 0 },

            { typeof(ModelData.AudioType), 0 },
            { typeof(ModelData.Audio), 0 },

            { typeof(ModelData.BehaviorInstanceDefinition), 0 },

            { typeof(ModelData.GraphicsInstanceDefinition), 0 },
            { typeof(ModelData.AnimationStateDefinition), 0 },
            { typeof(ModelData.AnimationFrameDefinition), 0 },
            { typeof(ModelData.FontTextureDefinition), 0 },
            { typeof(ModelData.Shader), 0 },
            { typeof(ModelData.TextureInformation), 0 },

            { typeof(ModelData.CollisionType), 0 },
            { typeof(ModelData.PhysType), 0 },
            { typeof(ModelData.PhysicsInstanceDefinition), 0 },

            { typeof(ModelData.Level), 0 },
            { typeof(ModelData.LevelLayout), 0 },
        };

        #endregion


        #region MEMBER PROPERTIES

        public static ObservableCollection<ModelData.EntityInstanceDefinition> EntityInstanceDefinitions { get { return s_entityInstanceDefinitions; } }

        public static ObservableCollection<ModelData.AudioType> AudioTypes { get { return s_audioTypes; } }
        public static ObservableCollection<ModelData.Audio> Audios { get { return s_audio; } }

        public static ObservableCollection<ModelData.BehaviorInstanceDefinition> BehaviorInstanceDefinitions { get { return s_behaviorInstanceDefinitions; } }

        public static ObservableCollection<ModelData.GraphicsInstanceDefinition> GraphicsInstanceDefinitions { get { return s_graphicsInstanceDefinition; } }
        public static ObservableCollection<ModelData.AnimationStateDefinition> AnimationStateDefinitions { get { return s_animationStateDefinitions; } }
        public static ObservableCollection<ModelData.AnimationFrameDefinition> AnimationFrameDefinitions { get { return s_animationFrameDefinitions; } }
        public static ObservableCollection<ModelData.FontTextureDefinition> FontTextureDefinitions { get { return s_fontTextureDefinition; } }
        public static ObservableCollection<ModelData.Shader> Shaders { get { return s_shaders; } }
        public static ObservableCollection<ModelData.TextureInformation> TextureInformation { get { return s_textureInformation; } }

        public static ObservableCollection<ModelData.CollisionType> CollisionTypes { get { return s_collisionTypes; } }
        public static ObservableCollection<ModelData.PhysType> PhysTypes { get { return s_physTypes; } }
        public static ObservableCollection<ModelData.PhysicsInstanceDefinition> PhysicsInstanceDefinitions { get { return s_physicsInstanceDefinitions; } }

        public static ObservableCollection<ModelData.Level> Levels { get { return s_levels; } }
        public static ObservableCollection<ModelData.LevelLayout> LevelLayouts { get { return s_levelLayouts; } }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        static DataManager()
        {
            // this mapping should only happen when PlayerPosition is not null, so it should be safe to assume that the Nullable<Point>.Value is not null
            Mapper.Configuration.CreateMap<Nullable<Point>, TTTD_Builder.Lib.Helpers.PositionInformation>()
                .ForMember(dest => dest.X, opt => opt.MapFrom(src => src.Value.X))
                .ForMember(dest => dest.Y, opt => opt.MapFrom(src => src.Value.Y));
            // rather than mapping from a PositionInformation class back to a Nullable<Point>, we just explicitly check the members and manually create a new Nullable<Point>
            // in the Level mapping
            //Mapper.Configuration.CreateMap<LibData.PositionInformation, Nullable<Point>>();

            Mapper.Configuration.CreateMap<ModelData.EntityInstanceDefinition, LibData.EntityInstanceDefinition>();
            Mapper.Configuration.CreateMap<LibData.EntityInstanceDefinition, ModelData.EntityInstanceDefinition>();

            Mapper.Configuration.CreateMap<ModelData.AudioType, LibData.AudioType>();
            Mapper.Configuration.CreateMap<LibData.AudioType, ModelData.AudioType>();

            Mapper.Configuration.CreateMap<ModelData.Audio, LibData.Audio>()
                .ForMember(dest => dest.AudioTypeId, opt => opt.MapFrom(src => src.AudioType.Id));
            Mapper.Configuration.CreateMap<LibData.Audio, ModelData.Audio>()
                .ForMember(dest => dest.AudioType, opt => opt.MapFrom(src => AudioTypes.FirstOrDefault(x => x.Id == src.AudioTypeId)));

            Mapper.Configuration.CreateMap<ModelData.BehaviorInstanceDefinition, LibData.BehaviorInstanceDefinition>()
                .ForMember(dest => dest.EntityInstanceDefinitionId, opt => opt.MapFrom(src => src.EntityInstanceDefinition.Id));
            Mapper.Configuration.CreateMap<LibData.BehaviorInstanceDefinition, ModelData.BehaviorInstanceDefinition>()
                .ForMember(dest => dest.EntityInstanceDefinition, opt => opt.MapFrom(src => EntityInstanceDefinitions.FirstOrDefault(x => x.Id == src.EntityInstanceDefinitionId)));

            Mapper.Configuration.CreateMap<ModelData.GraphicsInstanceDefinition, LibData.GraphicsInstanceDefinition>()
                .ForMember(dest => dest.EntityInstanceDefinitionId, opt => opt.MapFrom(src => src.EntityInstanceDefinition.Id));
            Mapper.Configuration.CreateMap<LibData.GraphicsInstanceDefinition, ModelData.GraphicsInstanceDefinition>()
                .ForMember(dest => dest.EntityInstanceDefinition, opt => opt.MapFrom(src => EntityInstanceDefinitions.FirstOrDefault(x => x.Id == src.EntityInstanceDefinitionId)));

            Mapper.Configuration.CreateMap<ModelData.AnimationStateDefinition, LibData.AnimationStateDefinition>()
                .ForMember(dest => dest.GraphicsInstanceDefinitionId, opt => opt.MapFrom(src => src.GraphicsInstanceDefinition.Id));
            Mapper.Configuration.CreateMap<LibData.AnimationStateDefinition, ModelData.AnimationStateDefinition>()
                .ForMember(dest => dest.GraphicsInstanceDefinition, opt => opt.MapFrom(src => GraphicsInstanceDefinitions.FirstOrDefault(x => x.Id == src.GraphicsInstanceDefinitionId)));

            Mapper.Configuration.CreateMap<ModelData.AnimationFrameDefinition, LibData.AnimationFrameDefinition>()
                .ForMember(dest => dest.AnimationStateDefinitionId, opt => opt.MapFrom(src => src.AnimationStateDefinition.Id));
            Mapper.Configuration.CreateMap<LibData.AnimationFrameDefinition, ModelData.AnimationFrameDefinition>()
                .ForMember(dest => dest.AnimationStateDefinition, opt => opt.MapFrom(src => AnimationStateDefinitions.SingleOrDefault(x => x.Id == src.AnimationStateDefinitionId)));

            Mapper.Configuration.CreateMap<ModelData.FontTextureDefinition, LibData.FontTextureDefinition>()
                .ForMember(dest => dest.GraphicsInstanceDefinitionId, opt => opt.MapFrom(src => src.GraphicsInstanceDefinition.Id));
            Mapper.Configuration.CreateMap<LibData.FontTextureDefinition, ModelData.FontTextureDefinition>()
                .ForMember(dest => dest.GraphicsInstanceDefinition, opt => opt.MapFrom(src => GraphicsInstanceDefinitions.FirstOrDefault(x => x.Id == src.GraphicsInstanceDefinitionId)));

            Mapper.Configuration.CreateMap<ModelData.Shader, LibData.Shader>();
            Mapper.Configuration.CreateMap<LibData.Shader, ModelData.Shader>();

            Mapper.Configuration.CreateMap<ModelData.TextureInformation, LibData.TextureInformation>();
            Mapper.Configuration.CreateMap<LibData.TextureInformation, ModelData.TextureInformation>();

            Mapper.Configuration.CreateMap<ModelData.CollisionType, LibData.CollisionType>();
            Mapper.Configuration.CreateMap<LibData.CollisionType, ModelData.CollisionType>();

            Mapper.Configuration.CreateMap<ModelData.PhysType, LibData.PhysType>();
            Mapper.Configuration.CreateMap<LibData.PhysType, ModelData.PhysType>();

            Mapper.Configuration.CreateMap<ModelData.PhysicsInstanceDefinition, LibData.PhysicsInstanceDefinition>()
                .ForMember(dest => dest.CollisionTypeId, opt => opt.MapFrom(src => src.CollisionType.Id))
                .ForMember(dest => dest.PhysTypeId, opt => opt.MapFrom(src => src.PhysType.Id))
                .ForMember(dest => dest.EntityInstanceDefinitionId, opt => opt.MapFrom(src => src.EntityInstanceDefinition.Id));
            Mapper.Configuration.CreateMap<LibData.PhysicsInstanceDefinition, ModelData.PhysicsInstanceDefinition>()
                .ForMember(dest => dest.CollisionType, opt => opt.MapFrom(src => CollisionTypes.FirstOrDefault(x => x.Id == src.CollisionTypeId)))
                .ForMember(dest => dest.PhysType, opt => opt.MapFrom(src => PhysTypes.FirstOrDefault(x => x.Id == src.PhysTypeId)))
                .ForMember(dest => dest.EntityInstanceDefinition, opt => opt.MapFrom(src => EntityInstanceDefinitions.FirstOrDefault(x => x.Id == src.EntityInstanceDefinitionId)));

            Mapper.Configuration.CreateMap<ModelData.Level, LibData.Level>()
                .ForMember(dest => dest.PlayerPosition, opt => opt.Condition(src => src.PlayerPosition != null));
            Mapper.Configuration.CreateMap<LibData.Level, ModelData.Level>()
                .ForMember(dest => dest.PlayerPosition, opt => opt.MapFrom(src => (src.PlayerPosition != null) ? new Nullable<Point>(new Point(src.PlayerPosition.X, src.PlayerPosition.Y)) : null));

            Mapper.Configuration.CreateMap<ModelData.LevelLayout, LibData.LevelLayout>()
                .ForMember(dest => dest.LevelId, opt => opt.MapFrom(src => src.Level.Id))
                .ForMember(dest => dest.EntityInstanceDefinitionId, opt => opt.MapFrom(src => src.EntityInstanceDefinition.Id))
                .ForMember(dest => dest.Data, opt => opt.MapFrom(src => src.Data));
            Mapper.Configuration.CreateMap<LibData.LevelLayout, ModelData.LevelLayout>()
                .ForMember(dest => dest.Level, opt => opt.MapFrom(src => Levels.FirstOrDefault(x => x.Id == src.LevelId)))
                .ForMember(dest => dest.EntityInstanceDefinition, opt => opt.MapFrom(src => EntityInstanceDefinitions.FirstOrDefault(x => x.Id == src.EntityInstanceDefinitionId)))
                .ForMember(dest => dest.Data, opt => opt.MapFrom(src => src.Data));
        }

        public static void Load()
        {
            ReaderWriterManager.CreateDataStoreSelector();

            LoadType<LibData.EntityInstanceDefinition, ModelData.EntityInstanceDefinition>(s_entityInstanceDefinitions);

            LoadType<LibData.AudioType, ModelData.AudioType>(s_audioTypes);
            LoadType<LibData.Audio, ModelData.Audio>(s_audio);

            LoadType<LibData.BehaviorInstanceDefinition, ModelData.BehaviorInstanceDefinition>(s_behaviorInstanceDefinitions);

            LoadType<LibData.GraphicsInstanceDefinition, ModelData.GraphicsInstanceDefinition>(s_graphicsInstanceDefinition);
            LoadType<LibData.AnimationStateDefinition, ModelData.AnimationStateDefinition>(s_animationStateDefinitions);
            LoadType<LibData.AnimationFrameDefinition, ModelData.AnimationFrameDefinition>(s_animationFrameDefinitions);
            LoadType<LibData.FontTextureDefinition, ModelData.FontTextureDefinition>(s_fontTextureDefinition);
            LoadType<LibData.Shader, ModelData.Shader>(s_shaders);
            LoadType<LibData.TextureInformation, ModelData.TextureInformation>(s_textureInformation);

            LoadType<LibData.CollisionType, ModelData.CollisionType>(s_collisionTypes);
            LoadType<LibData.PhysType, ModelData.PhysType>(s_physTypes);
            LoadType<LibData.PhysicsInstanceDefinition, ModelData.PhysicsInstanceDefinition>(s_physicsInstanceDefinitions);

            LoadType<LibData.Level, ModelData.Level>(s_levels);
            LoadType<LibData.LevelLayout, ModelData.LevelLayout>(s_levelLayouts);
        }

        public static void Save()
        {
            ReaderWriterManager.CreateDataStoreSelector();

            SaveType<LibData.EntityInstanceDefinition, ModelData.EntityInstanceDefinition>(s_entityInstanceDefinitions);

            SaveType<LibData.AudioType, ModelData.AudioType>(s_audioTypes);
            SaveType<LibData.Audio, ModelData.Audio>(s_audio);

            SaveType<LibData.BehaviorInstanceDefinition, ModelData.BehaviorInstanceDefinition>(s_behaviorInstanceDefinitions);

            SaveType<LibData.GraphicsInstanceDefinition, ModelData.GraphicsInstanceDefinition>(s_graphicsInstanceDefinition);
            SaveType<LibData.AnimationStateDefinition, ModelData.AnimationStateDefinition>(s_animationStateDefinitions);
            SaveType<LibData.AnimationFrameDefinition, ModelData.AnimationFrameDefinition>(s_animationFrameDefinitions);
            SaveType<LibData.FontTextureDefinition, ModelData.FontTextureDefinition>(s_fontTextureDefinition);
            SaveType<LibData.Shader, ModelData.Shader>(s_shaders);
            SaveType<LibData.TextureInformation, ModelData.TextureInformation>(s_textureInformation);

            SaveType<LibData.CollisionType, ModelData.CollisionType>(s_collisionTypes);
            SaveType<LibData.PhysType, ModelData.PhysType>(s_physTypes);
            SaveType<LibData.PhysicsInstanceDefinition, ModelData.PhysicsInstanceDefinition>(s_physicsInstanceDefinitions);

            SaveType<LibData.Level, ModelData.Level>(s_levels);
            SaveType<LibData.LevelLayout, ModelData.LevelLayout>(s_levelLayouts);
        }

        public static int GenerateId<T>()
        {
            return s_idGenerator[typeof(T)]++;
        }

        public static T Generate<T>() where T : TTTD_Builder.Model.Data.Base.DataBase, new()
        {
            T t = new T();
            t.Id = GenerateId<T>();
            return t;
        }

        #endregion


        #region Private Functionality

        private static void LoadType<LIBTYPE, MODELTYPE>(ObservableCollection<MODELTYPE> collection) where MODELTYPE : IHasId
        {
            var read = ReaderWriterManager.Read<LIBTYPE>();
            if (read != null)
            {
                collection.Clear();
                collection.AddRange<MODELTYPE>(read.Select(x => Mapper.Map<MODELTYPE>(x)));

                s_idGenerator[typeof(MODELTYPE)] = collection.Max(x => x.Id) + 1;
            }
        }

        private static void SaveType<LIBTYPE, MODELTYPE>(ObservableCollection<MODELTYPE> collection)
        {
            ReaderWriterManager.Write<LIBTYPE>(collection.Select(x => Mapper.Map<LIBTYPE>(x)));
        }

        #endregion

        #endregion

    }
}
