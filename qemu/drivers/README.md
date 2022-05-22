## QEMU API

### Objects
- DEVICE_CLASS
- PCI_DEVICE_CLASS

### MMIO
- memory_region_init_io 

### Threads
- [qemu_thread_create] 
- [qemu_mutex_init] 
- [qemu_mutex_lock] 
- [qemu_cond_init] 
- [qemu_cond_destroy]
- [qemu_mutex_destroy]


## QEMU INTERNALS

### memory.h

```
typedef struct MemoryRegionOps MemoryRegionOps;
typedef struct MemoryRegion MemoryRegion;
typedef struct MemoryRegionPortio MemoryRegionPortio;
typedef struct MemoryRegionMmio MemoryRegionMmio;
```

### QOM
https://qemu.readthedocs.io/en/latest/devel/qom.html

## EDU PCI

https://blog.haochengxia.com/jekyll/update/2020/09/05/Begin-with-QEMU-educational-PCI-device.html

### Flow
1. pci_edu_register_types
    1. edu_instance_init
    2. edu_class_init
        1. pci_edu_realize
            1. Set interrupts pins
            2. Init timer
            3. Init mutex, thread, memory region
            4. pci_register_bar
        2. pci_edu_unitunit
        3. set_bit(DEVICE_CATEGORY_MISC, dc->categories)
2. type_init(pci_edu_register_types)
3. QEMU runs pci_edu_register_types as callback

### Registering Types
Sets pci_edu_register_types as a callback using QEMU API's type_init(). Registers all initial types.
```
static void pci_edu_register_types(void)
{
    static InterfaceInfo interfaces[] = {
        { INTERFACE_CONVENTIONAL_PCI_DEVICE },
        { },
    };
    static const TypeInfo edu_info = {
        .name          = TYPE_PCI_EDU_DEVICE,
        .parent        = TYPE_PCI_DEVICE,
        .instance_size = sizeof(EduState),
        .instance_init = edu_instance_init,
        .class_init    = edu_class_init,	// pci device init func
        .interfaces = interfaces,
    };

    type_register_static(&edu_info); // register device structure
}
type_init(pci_edu_register_types)
```