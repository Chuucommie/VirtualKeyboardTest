using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.FluentUI.AspNetCore.Components;
using VirtualKeyboardDemo;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

// Fluent UI services
builder.Services.AddFluentUIComponents();

// Custom component activator for FluentUI v5 (constructor injection)
builder.Services.AddScoped<IComponentActivator, DIComponentActivator>();

await builder.Build().RunAsync();