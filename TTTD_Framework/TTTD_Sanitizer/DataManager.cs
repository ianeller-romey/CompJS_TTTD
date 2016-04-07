using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;

using TTTD_DataReaderWriter;

using BData = TTTD_Builder.Lib.Data;
using SData = TTTD_Sanitizer.Lib.Data;


namespace TTTD_Sanitizer
{
    public static class DataManager
    {
        #region MEMBER FIELDS

        private static List<BData.EntityInstanceDefinition> s_entityInstanceDefinitions = new List<BData.EntityInstanceDefinition>();

        private static List<BData.AudioType> s_audioTypes = new List<BData.AudioType>();
        private static List<BData.Audio> s_audio = new List<BData.Audio>();

        private static List<BData.BehaviorInstanceDefinition> s_behaviorInstanceDefinitions = new List<BData.BehaviorInstanceDefinition>();

        private static List<BData.GraphicsInstanceDefinition> s_graphicsInstanceDefinitions = new List<BData.GraphicsInstanceDefinition>();
        private static List<BData.AnimationStateDefinition> s_animationStateDefinitions = new List<BData.AnimationStateDefinition>();
        private static List<BData.AnimationFrameDefinition> s_animationFrameDefinitions = new List<BData.AnimationFrameDefinition>();
        private static List<BData.FontTextureDefinition> s_fontTextureDefinitions = new List<BData.FontTextureDefinition>();
        private static List<BData.Shader> s_shaders = new List<BData.Shader>();
        private static List<BData.TextureInformation> s_textureInformation = new List<BData.TextureInformation>();
        
        private static List<BData.CollisionType> s_collisionTypes = new List<BData.CollisionType>();
        private static List<BData.PhysType> s_physTypes = new List<BData.PhysType>();
        private static List<BData.PhysicsInstanceDefinition> s_physicsInstanceDefinitions = new List<BData.PhysicsInstanceDefinition>();

        private static List<BData.Level> s_levels = new List<BData.Level>();
        private static List<BData.LevelLayout> s_levelLayouts = new List<BData.LevelLayout>();

        private static DataStorePassThrough s_dataStorePassThrough;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        static DataManager()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<TTTD_Builder.Lib.Helpers.PositionInformation, TTTD_Sanitizer.Lib.Helpers.PositionInformation>();

                cfg.CreateMap<BData.EntityInstanceDefinition, SData.EntityInstanceDefinition>();

                cfg.CreateMap<BData.AudioType, SData.AudioType>();
                cfg.CreateMap<BData.Audio, SData.Audio>();

                cfg.CreateMap<BData.BehaviorInstanceDefinition, SData.BehaviorInstanceDefinition>().
                    ForMember(dest => dest.BehaviorFile, opt => opt.MapFrom(src => Path.Combine("lib/behaviors/", Path.GetFileName(src.BehaviorFile))));

                cfg.CreateMap<BData.GraphicsInstanceDefinition, SData.GraphicsAnimationInstanceDefinition>();
                cfg.CreateMap<BData.AnimationStateDefinition, SData.GraphicsAnimationInstanceDefinition.AnimationStateDefinition>();
                cfg.CreateMap<BData.AnimationFrameDefinition, SData.GraphicsAnimationInstanceDefinition.AnimationStateDefinition.AnimationFrameDefinition>().
                    ForMember(dest => dest.Texture, opt => opt.MapFrom(src => Path.Combine("assets/textures/", Path.GetFileName(src.Texture))));
                cfg.CreateMap<BData.GraphicsInstanceDefinition, SData.GraphicsFontInstanceDefinition>();
                cfg.CreateMap<BData.FontTextureDefinition, SData.GraphicsFontInstanceDefinition.FontTextureDefinition>().
                    ForMember(dest => dest.Texture, opt => opt.MapFrom(src => Path.Combine("assets/textures/", Path.GetFileName(src.Texture))));
                cfg.CreateMap<BData.Shader, SData.Shader>().
                    ForMember(dest => dest.ShaderFile, opt => opt.MapFrom(src => Path.Combine("lib/shaders/", Path.GetFileName(src.ShaderFile))));
                cfg.CreateMap<BData.TextureInformation, SData.TextureInformation>().
                    ForMember(dest => dest.Texture, opt => opt.MapFrom(src => Path.Combine("assets/textures/", Path.GetFileName(src.Texture))));

                cfg.CreateMap<BData.CollisionType, SData.CollisionType>();
                cfg.CreateMap<BData.PhysType, SData.PhysType>();
                cfg.CreateMap<BData.PhysicsInstanceDefinition, SData.PhysicsInstanceDefinition>();

                cfg.CreateMap<BData.Level, SData.Level>();
                cfg.CreateMap<BData.LevelLayout, SData.Level.LevelLayout>();
            });
            
        }

        public static void LoadBuilderData(string inputDirectory)
        {
            s_dataStorePassThrough = new DataStorePassThrough(inputDirectory);
                   
            ReadBuilderData<BData.EntityInstanceDefinition>(s_entityInstanceDefinitions);

            ReadBuilderData<BData.AudioType>(s_audioTypes);
            ReadBuilderData<BData.Audio>(s_audio);

            ReadBuilderData<BData.BehaviorInstanceDefinition>(s_behaviorInstanceDefinitions);

            ReadBuilderData<BData.GraphicsInstanceDefinition>(s_graphicsInstanceDefinitions);
            ReadBuilderData<BData.AnimationStateDefinition>(s_animationStateDefinitions);
            ReadBuilderData<BData.AnimationFrameDefinition>(s_animationFrameDefinitions);
            ReadBuilderData<BData.FontTextureDefinition>(s_fontTextureDefinitions);
            ReadBuilderData<BData.Shader>(s_shaders);
            ReadBuilderData<BData.TextureInformation>(s_textureInformation);
        
            ReadBuilderData<BData.CollisionType>(s_collisionTypes);
            ReadBuilderData<BData.PhysType>(s_physTypes);
            ReadBuilderData<BData.PhysicsInstanceDefinition>(s_physicsInstanceDefinitions);

            ReadBuilderData<BData.Level>(s_levels);
            ReadBuilderData<BData.LevelLayout>(s_levelLayouts);
        }

        public static void SanitizeBuilderData(string outputDirectory)
        {
            s_dataStorePassThrough = new DataStorePassThrough(outputDirectory);

            WriteSantizerData<SData.EntityInstanceDefinition>(SanitizeEntityInstanceDefinitions);

            WriteSantizerData<SData.AudioType>(SanitizeAudioTypes);
            WriteSantizerData<SData.Audio>(SanitizeAudio);

            WriteSantizerData<SData.BehaviorInstanceDefinition>(SanitizeBehaviorInstanceDefinitions);

            WriteSantizerData<SData.GraphicsAnimationInstanceDefinition>(SanitizeGraphicsAnimationInstanceDefinitions);
            WriteSantizerData<SData.GraphicsFontInstanceDefinition>(SanitizeGraphicsFontInstanceDefinitions);
            WriteSantizerData<SData.Shader>(SanitizeShaders);
            WriteSantizerData<SData.TextureInformation>(SanitizeTextureInformation);

            WriteSantizerData<SData.CollisionType>(SanitizeCollisionTypes);
            WriteSantizerData<SData.PhysType>(SanitizePhysTypes);
            WriteSantizerData<SData.PhysicsInstanceDefinition>(SanitizePhysicsInstanceDefinitions);

            WriteSantizerData<SData.Level>(SanitizeLevels);
        }

        #endregion


        #region Private Functionality

        private static void ReadBuilderData<T>(List<T> list)
        {
            var read = ReaderWriterManager.ReadBuilderData<T>(s_dataStorePassThrough, s_dataStorePassThrough.DataStore);
            if (read != null)
            {
                list.Clear();
                foreach (var x in read)
                    list.Add(x);
            }
        }

        private static void WriteSantizerData<T>(Func<IEnumerable<T>> sanitizerFunction)
        {
            var write = sanitizerFunction();
            if (write != null)
            {
                ReaderWriterManager.WriteSanitizerData<T>(write, s_dataStorePassThrough, s_dataStorePassThrough.DataStore);
            }
        }

        static List<SData.EntityInstanceDefinition> SanitizeEntityInstanceDefinitions()
        {
            var list = Mapper.Map<List<BData.EntityInstanceDefinition>, List<SData.EntityInstanceDefinition>>(s_entityInstanceDefinitions);
            foreach (var x in list)
            {
                {
                    x.Audible = null;
                }

                {
                    var b = s_behaviorInstanceDefinitions.FirstOrDefault(y => y.EntityInstanceDefinitionId == x.Id);
                    x.Behavior = (b != null) ? (int?)b.Id : null;
                }

                {
                    var g = s_graphicsInstanceDefinitions.FirstOrDefault(y => y.EntityInstanceDefinitionId == x.Id);
                    x.Graphics = (g != null) ? (int?)g.Id : null;
                }

                {
                    var p = s_physicsInstanceDefinitions.FirstOrDefault(y => y.EntityInstanceDefinitionId == x.Id);
                    x.Physics = (p != null) ? (int?)p.Id : null;
                }
            }

            return list;
        }

        static List<SData.AudioType> SanitizeAudioTypes()
        {
            return Mapper.Map<List<BData.AudioType>, List<SData.AudioType>>(s_audioTypes);
        }

        static List<SData.Audio> SanitizeAudio()
        {
            return Mapper.Map<List<BData.Audio>, List<SData.Audio>>(s_audio);
        }

        static List<SData.BehaviorInstanceDefinition> SanitizeBehaviorInstanceDefinitions()
        {
            return Mapper.Map<List<BData.BehaviorInstanceDefinition>, List<SData.BehaviorInstanceDefinition>>(s_behaviorInstanceDefinitions);
        }

        static List<SData.GraphicsAnimationInstanceDefinition> SanitizeGraphicsAnimationInstanceDefinitions()
        {
            var list = Mapper.Map<List<BData.GraphicsInstanceDefinition>, List<SData.GraphicsAnimationInstanceDefinition>>(s_graphicsInstanceDefinitions.Where(x => s_animationStateDefinitions.Any(y => y.GraphicsInstanceDefinitionId == x.Id)).ToList());

            foreach (var x in list)
            {
                x.AnimationStateDefinitions = Mapper.Map<List<BData.AnimationStateDefinition>, SData.GraphicsAnimationInstanceDefinition.AnimationStateDefinition[]>(s_animationStateDefinitions.Where(y => y.GraphicsInstanceDefinitionId == x.Id).ToList());
                foreach (var y in x.AnimationStateDefinitions)
                {
                    y.AnimationFrameDefinitions = Mapper.Map<List<BData.AnimationFrameDefinition>, SData.GraphicsAnimationInstanceDefinition.AnimationStateDefinition.AnimationFrameDefinition[]>(s_animationFrameDefinitions.Where(z => z.AnimationStateDefinitionId == y.Id).ToList());
                }
            }

            return list;
        }

        static List<SData.GraphicsFontInstanceDefinition> SanitizeGraphicsFontInstanceDefinitions()
        {
            var list = Mapper.Map<List<BData.GraphicsInstanceDefinition>, List<SData.GraphicsFontInstanceDefinition>>(s_graphicsInstanceDefinitions.Where(x => s_fontTextureDefinitions.Any(y => y.GraphicsInstanceDefinitionId == x.Id)).ToList());

            foreach (var x in list)
            {
                x.SingleFontTextureDefinition = Mapper.Map<BData.FontTextureDefinition, SData.GraphicsFontInstanceDefinition.FontTextureDefinition>(s_fontTextureDefinitions.First(y => y.GraphicsInstanceDefinitionId == x.Id));
            }

            return list;
        }

        static List<SData.Shader> SanitizeShaders()
        {
            return Mapper.Map<List<BData.Shader>, List<SData.Shader>>(s_shaders);
        }

        static List<SData.TextureInformation> SanitizeTextureInformation()
        {
            return Mapper.Map<List<BData.TextureInformation>, List<SData.TextureInformation>>(s_textureInformation);
        }

        static List<SData.CollisionType> SanitizeCollisionTypes()
        {
            return Mapper.Map<List<BData.CollisionType>, List<SData.CollisionType>>(s_collisionTypes);
        }

        static List<SData.PhysType> SanitizePhysTypes()
        {
            return Mapper.Map<List<BData.PhysType>, List<SData.PhysType>>(s_physTypes);
        }

        static List<SData.PhysicsInstanceDefinition> SanitizePhysicsInstanceDefinitions()
        {
            return Mapper.Map<List<BData.PhysicsInstanceDefinition>, List<SData.PhysicsInstanceDefinition>>(s_physicsInstanceDefinitions);
        }

        static List<SData.Level> SanitizeLevels()
        {
            var list = Mapper.Map<List<BData.Level>, List<SData.Level>>(s_levels);
            foreach (var x in list)
            {
                x.Layout = Mapper.Map<List<BData.LevelLayout>, SData.Level.LevelLayout[]>(s_levelLayouts.Where(y => y.LevelId == x.Id).ToList());
            }

            return list;
        }

        #endregion

        #endregion

    }
}
