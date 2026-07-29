using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.DependencyInjection;

namespace VirtualKeyboardDemo;

/// <summary>
/// Component activator that uses DI ServiceProvider to resolve components
/// with parameterized constructors (e.g. FluentUI v5 components that inject services).
/// </summary>
public class DIComponentActivator : IComponentActivator
{
    private readonly IServiceProvider _serviceProvider;

    public DIComponentActivator(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public IComponent CreateInstance(Type componentType)
    {
        // Try DI resolution first (handles constructor injection)
        try
        {
            var instance = ActivatorUtilities.CreateInstance(_serviceProvider, componentType);
            if (instance is IComponent component)
                return component;
        }
        catch { }

        // Fallback: default parameterless constructor
        return (IComponent)Activator.CreateInstance(componentType, true)!;
    }
}