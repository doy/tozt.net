package Tozt;
use Moose;
use MooseX::Types::Path::Class qw(Dir);
use namespace::autoclean;

use File::Copy::Recursive qw(rcopy);
use Path::Class ();
use Template;

with 'MooseX::Getopt';

has output_dir => (
    is      => 'ro',
    isa     => Dir,
    coerce  => 1,
    default => 'site',
);

has template_dir => (
    is      => 'ro',
    isa     => Dir,
    coerce  => 1,
    default => 'root/template',
);

has static_dir => (
    is      => 'ro',
    isa     => Dir,
    coerce  => 1,
    default => 'root/static',
);

has templater => (
    traits   => ['NoGetopt'],
    is       => 'ro',
    isa      => 'Template',
    lazy     => 1,
    init_arg => undef,
    default  => sub {
        Template->new(
            INCLUDE_PATH => shift->template_dir,
        );
    },
);

sub pages {
    my $self = shift;
    map { substr($_->basename, 0, -3) }
        grep { $_->isa('Path::Class::File')
            && $_->basename =~ /\.tt$/
            && $_->basename ne 'wrapper.tt' } $self->template_dir->children;
}

sub render_page {
    my $self = shift;
    my ($page) = @_;
    my $contents = $self->template_dir->file("$page.tt")->slurp;
    my $wrapper = <<WRAPPER;
[% WRAPPER wrapper.tt %]
$contents
[% END %]
WRAPPER

    mkdir $self->output_dir unless -d $self->output_dir;
    $self->templater->process(
        \$wrapper,
        { page => $page },
        $self->output_dir->file("$page.html")->stringify,
    );
}

sub render_all {
    my $self = shift;
    for my $page ($self->pages) {
        print "Rendering $page...\n";
        $self->render_page($page);
    }
}

sub update_static {
    my $self = shift;
    for my $file ($self->static_dir->children) {
        rcopy($file, $self->output_dir);
    }
}

__PACKAGE__->meta->make_immutable;
no Moose;

1;
